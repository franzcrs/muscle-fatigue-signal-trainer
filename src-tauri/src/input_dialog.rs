use egui::{Context, FontFamily, FontId, TextStyle};
use egui_glow::glow;
use raw_window_handle::{HasWindowHandle, HasDisplayHandle};
use std::sync::{Arc, Mutex};

pub struct InputDialog {
    pub input_text: Arc<Mutex<String>>,
    painter: egui_glow::Painter,
    egui_ctx: Context,
    gl: Arc<glow::Context>,
}

impl InputDialog {
    pub fn new<W>(window: &W, gl: Arc<glow::Context>) -> Self 
    where
        W: HasWindowHandle + HasDisplayHandle,
    {
        let painter = egui_glow::Painter::new(gl.clone(), "", None).unwrap();
        let egui_ctx = Context::default();
        
        // Set up custom fonts and style
        let mut style = (*egui_ctx.style()).clone();
        style.text_styles.insert(
            TextStyle::Body,
            FontId::new(16.0, FontFamily::Proportional),
        );
        egui_ctx.set_style(style);

        Self {
            input_text: Arc::new(Mutex::new(String::new())),
            painter,
            egui_ctx,
            gl,
        }
    }

    pub fn paint(&mut self, window_size: [u32; 2]) {
        let input = egui::RawInput::default();
        self.egui_ctx.begin_frame(input);

        egui::CentralPanel::default().show(&self.egui_ctx, |ui| {
            ui.vertical_centered(|ui| {
                ui.add_space(20.0);
                ui.heading("Enter Project Name");
                ui.add_space(10.0);
                
                let mut text = self.input_text.lock().unwrap();
                let response = ui.text_edit_singleline(&mut *text);
                
                if response.lost_focus() && ui.input(|i| i.key_pressed(egui::Key::Enter)) {
                    println!("Input submitted: {}", *text);
                    // TODO: Handle input submission
                }
            });
        });

        let output = self.egui_ctx.end_frame();
        let paint_jobs = self.egui_ctx.tessellate(output.shapes, output.pixels_per_point);

        let dimensions = [window_size[0] as u32, window_size[1] as u32];
        self.painter.paint_and_update_textures(
            dimensions,
            self.egui_ctx.pixels_per_point(),
            &paint_jobs,
            &output.textures_delta,
        );
    }

    pub fn destroy(&mut self) {
        self.painter.destroy();
    }
}