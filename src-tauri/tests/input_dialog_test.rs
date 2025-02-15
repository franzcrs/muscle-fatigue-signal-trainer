#[cfg(test)]
mod tests {
    use app_lib::input_dialog::InputDialog;
    use std::sync::Arc;
    use raw_window_handle::{WindowHandle, DisplayHandle, HandleError};

    struct MockWindow;
    impl raw_window_handle::HasWindowHandle for MockWindow {
        fn window_handle(&self) -> Result<WindowHandle<'_>, HandleError> {
            unimplemented!("Mock window handle")
        }
    }
    
    impl raw_window_handle::HasDisplayHandle for MockWindow {
        fn display_handle(&self) -> Result<DisplayHandle<'_>, HandleError> {
            unimplemented!("Mock display handle")
        }
    }

    // #[test]
    // fn test_input_dialog_creation() {
    //     let mock_window = MockWindow;
    //     let gl_context = unsafe {
    //         glow::Context::from_loader_function(|_| {
    //             None as *const std::ffi::c_void
    //         })
    //     };
    //     let gl = Arc::new(gl_context);
        
    //     let input_dialog = InputDialog::new(&mock_window, gl);
    //     assert!(input_dialog.input_text.lock().unwrap().is_empty());
    // }
}