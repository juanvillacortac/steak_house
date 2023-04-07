#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use tauri::api::process::Command;

fn main() {
    tauri::Builder::default()
        .setup(|_app| {
            if !cfg!(dev) {
                tauri::async_runtime::spawn(async move {
                    Command::new_sidecar("server")
                        .expect("failed to setup `server` sidecar")
                        .spawn()
                        .expect("Failed to spawn packaged server");
                });
            }
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
