#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use tauri::Manager;
pub mod input_dialog;
use egui_glow::glow;
use input_dialog::InputDialog;
use raw_window_handle::{HasWindowHandle, RawWindowHandle};
use std::ffi::c_void;
use std::sync::Arc;

#[tauri::command]
fn show_input_dialog(app_handle: tauri::AppHandle) {
    let main_window = app_handle.get_window("main").unwrap();
    let parent_size = main_window.inner_size().unwrap();
    let dialog_width = 400.0;
    let dialog_height = 200.0;
    let scale_factor = main_window.scale_factor().unwrap();
    let dialog_x = (parent_size.width as f64 - dialog_width) / 2.0 / scale_factor;
    let dialog_y = (parent_size.height as f64 - dialog_height) / 2.0 / scale_factor;

    let dialog_window = tauri::window::WindowBuilder::new(&app_handle, "input_dialog")
        .position(dialog_x, dialog_y)
        .inner_size(dialog_width, dialog_height)
        .resizable(false)
        .maximizable(false)
        .minimizable(false)
        .closable(false)
        .title("")
        .focused(true)
        .always_on_top(true)
        .content_protected(true)
        .shadow(true)
        .parent(&main_window)
        .unwrap()
        .build()
        .unwrap();

    // Initialize OpenGL context
    let gl_context = unsafe {
        glow::Context::from_loader_function(|s| {
            let handle = dialog_window.window_handle().unwrap();
            // Convert handle to pointer using as_ptr()
            match handle.as_raw() {
                RawWindowHandle::AppKit(handle) => {
                    // Use handle to create OpenGL context
                    // Return pointer to OpenGL context
                    handle.ns_view.as_ptr() as *const c_void
                }
                handle => unreachable!("unknown handle {handle:?} for platform"),
            }
        })
    };

    let gl = Arc::new(gl_context);

    // Create input dialog
    let mut input_dialog = InputDialog::new(&dialog_window, gl.clone());

    dialog_window.on_window_event(move |event| match event {
        tauri::WindowEvent::Focused(false) => {
            if app_handle.get_window("main").unwrap().is_focused().unwrap() {
                app_handle
                    .get_window("input_dialog")
                    .unwrap()
                    .set_focus()
                    .ok();
            }
        }
        // tauri::WindowEvent::CloseRequested { api: _, .. } => {
        //     input_dialog.destroy();
        // }
        _ => {}
    });

    // In Tauri 2.0, windows are automatically redrawn when needed
    // No need to explicitly request redraws
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![show_input_dialog])
        .setup(|app| {
            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;
            }
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
