#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use tauri::Manager;

// TODO: Create with tao the new folder dialog
// TODO: Create with tauri WindowBuilder the new folder dialog
#[tauri::command]
fn show_input_dialog(app_handle: tauri::AppHandle) {
    /* Tauri-egui implementation */

    /* Tauri implementation */
    let main_window = app_handle.get_window("main").unwrap();
    // let main_window = app_handle.get_webview_window("main").unwrap();
    // let parent_pos = main_window.outer_position().unwrap(); // Parent window position
    let parent_size = main_window.inner_size().unwrap(); // Parent window size
    // println!("Parent window size: width: {}, height: {}", parent_size.width, parent_size.height);
    // Input dialog size
    let dialog_width = 400.0;
    let dialog_height = 200.0;
    // Get the scale factor for calculating the physical position
    let scale_factor = main_window.scale_factor().unwrap();
    // Input dialog position
    let dialog_x = (parent_size.width as f64 - dialog_width) / 2.0 / scale_factor;
    let dialog_y = (parent_size.height as f64 - dialog_height) / 2.0 / scale_factor;
    println!("Input dialog position: x: {}, y: {}", dialog_x, dialog_y);

    // To use tauri::window::WindowBuilder::new() we need to set the feature unstable in the Cargo.toml: tauri = { version = "2.2.1", features = ["unstable"] }
    // let dialog_window = tauri::WebviewWindowBuilder::new(&app_handle, "input_dialog", tauri::WebviewUrl::App("src/input_dialog.html".into()))
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
    // Disable all cursor events to block any drag or resize. All cursor events will go through and effects will occur in the parent window
    dialog_window.set_ignore_cursor_events(true).ok();
    dialog_window.set_title_bar_style(tauri_utils::TitleBarStyle::Transparent).ok();

    dialog_window.on_window_event(move |event| {
      match event {
        tauri::WindowEvent::Focused(false) => {
          // Parent window will be focused on any click on the dialog window. Only when this happens after loosing focus of the dialog window, bring the focus back to the dialog window
          if app_handle.get_window("main").unwrap().is_focused().unwrap() {
            app_handle.get_window("input_dialog").unwrap().set_focus().ok();
        }},
          _ => {}, 
        }
        // if let tauri::WindowEvent::Focused(false) = event {
        //     // If the child loses focus, bring it back
        //     println!("Child lost focus, refocusing...");
        //     app_handle.get_window("input_dialog").unwrap().set_focus().ok();
        // }
    });
    // tauri::Builder::default().on_window_event(|window, event| {
    //     // Identify the window by its label
    //     match event {
    //         tauri::WindowEvent::Focused(focused) => {
    //             if window.get_window("input_dialog").unwrap().label() == "input_dialog" && !focused {
    //                 // If the child loses focus, bring it back
    //                 println!("Child lost focus, refocusing...");
    //                 window.get_window("input_dialog").unwrap().set_focus();
    //             }
    //         }
    //         _ => {}
    //     }
    // })

    /* Tao implementation */
    // use tao::{
    //   dpi::{LogicalSize,LogicalPosition, PhysicalPosition},
    //   event_loop::{ControlFlow, EventLoop},
    //   window::WindowBuilder,
    //   event::{Event, WindowEvent},
    // };
    // #[cfg(target_os = "macos")]
    // use tao::platform::macos::{WindowBuilderExtMacOS, WindowExtMacOS};
    // #[cfg(target_os = "linux")]
    // use tao::platform::unix::{WindowBuilderExtUnix, WindowExtUnix};
    // #[cfg(target_os = "windows")]
    // use tao::platform::windows::{WindowBuilderExtWindows, WindowExtWindows};

    // // Create a new child window
    // let main_window = app_handle.get_webview_window("main").unwrap();

    // #[cfg(target_os = "macos")]
    // let parent_window = main_window.ns_window();
    // #[cfg(target_os = "windows")]
    // let parent_window = main_window.hwnd();
    // #[cfg(target_os = "linux")]
    // let parent_window = main_window.gtk_window();

    // let parent_pos = main_window.outer_position().unwrap(); // Parent window position
    // let parent_size = main_window.inner_size().unwrap(); // Parent window size
    // let child_width = 400;
    // let child_height = 200;

    // // Calculate centered position
    // let child_x = (parent_size.width as i32 - child_width) / 2;
    // let child_y = (parent_size.height as i32 - child_height) / 2;

    // let event_loop = EventLoop::new();

    // let dialog_window_builder = WindowBuilder::new()
    //     .with_inner_size(LogicalSize::new(child_width, child_height)) // Child window size
    //     .with_position(PhysicalPosition::new(child_x, child_y)) // Set child window position
    //     .with_resizable(false)
    //     .with_minimizable(false)
    //     .with_maximizable(false)
    //     .with_closable(false)
    //     .with_title("Input Dialog")
    //     // .with_transparent(true)
    //     // .with_decorations(false) // No title bar
    //     .with_always_on_top(true)
    //     .with_focused(true)
    //     .with_content_protection(true);

    // #[cfg(any(target_os = "windows", target_os = "macos"))]
    // let dialog_window_builder = dialog_window_builder.with_parent_window(parent_window.unwrap().clone());
    // #[cfg(target_os = "linux")]
    // let dialog_window_builder = dialog_window_builder.with_transient_for(parent_window);

    // let dialog_window = dialog_window_builder.build(&event_loop).unwrap();
    // dialog_window.set_ignore_cursor_events(true);

    // event_loop.run(move |event, _, control_flow| {
    //     *control_flow = ControlFlow::Wait;

    //     match event {
    //       Event::WindowEvent {
    //           event: WindowEvent::Focused(false),
    //           window_id, ..
    //       } if window_id == dialog_window.id() => {
    //           // 🔄 If child loses focus, bring it back
    //           println!("Child lost focus, refocusing...");
    //           dialog_window.set_focus();
    //       }
    //       _ => (),
    //     }
    // });
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
