import http.server
import socketserver
import os
import json

PORT = 8089
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class CustomHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def do_GET(self):
        try:
            import excel_db
            excel_db.sync_excel_if_modified()
        except Exception as e:
            pass
        super().do_GET()

    def do_POST(self):
        endpoints = {
            '/api/save-news': 'news.json',
            '/api/save-players': 'players.json',
            '/api/save-media': 'media.json',
            '/api/save-matches': 'matches.json'
        }
        
        if self.path in endpoints:
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length)
            try:
                data = json.loads(post_data.decode('utf-8'))
                target_file = os.path.join(DIRECTORY, 'src', 'data', endpoints[self.path])
                os.makedirs(os.path.dirname(target_file), exist_ok=True)
                with open(target_file, 'w', encoding='utf-8') as f:
                    json.dump(data, f, ensure_ascii=False, indent=2)
                
                # Sincronizar automáticamente con la base de datos Excel
                try:
                    import excel_db
                    excel_db.export_all_to_excel()
                except Exception as ex_err:
                    print(f"[Server] Advertencia sincronizando Excel: {ex_err}")

                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps({"status": "ok", "file": endpoints[self.path], "message": "Guardado permanente en disco exitoso"}).encode('utf-8'))
                return
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"status": "error", "message": str(e)}).encode('utf-8'))
                return
        
        super().do_POST()

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

if __name__ == "__main__":
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("0.0.0.0", PORT), CustomHandler) as httpd:
        print(f"Serving HTTP on 0.0.0.0 port {PORT}...")
        httpd.serve_forever()

