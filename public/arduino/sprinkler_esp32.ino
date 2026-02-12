#include <WiFi.h>
#include <AsyncTCP.h>
#include <ESPAsyncWebServer.h>
#include <ArduinoJson.h>

// Pin konfigurasi
#define TRIG_PIN 2
#define ECHO_PIN 4
#define HUMID_PIN 34
#define RELAY_1 22
#define RELAY_2 23

// Variabel global
int jarak;
long durasi;
float humid;
bool sprinklerOn = false;
bool pumpOn = false;
bool manualMode = false;
float manualHumidity = 0;
int manualWater = 0;

// Konfigurasi WiFi
const char* ssid = "EcoSpray";
const char* password = "ecospray";
IPAddress local_IP(192, 168, 1, 100); // Ganti dengan alamat IP yang Anda inginkan
IPAddress gateway(192, 168, 1, 1);    // Ganti dengan alamat gateway Anda
IPAddress subnet(255, 255, 255, 0);   // Subnet mask yang umum digunakan

// Deklarasi server
AsyncWebServer server(80);
AsyncWebSocket ws("/ws");

// Fungsi pembacaan ultrasonic
void readUltrasonic() {
  if (!manualMode) {
    digitalWrite(TRIG_PIN, LOW);
    delayMicroseconds(2);
    digitalWrite(TRIG_PIN, HIGH);
    delayMicroseconds(10);
    digitalWrite(TRIG_PIN, LOW);
    durasi = pulseIn(ECHO_PIN, HIGH);
    jarak = (durasi * 0.343) / 2;
  } else {
    jarak = manualWater;
  }

  if (jarak > 20) {
    digitalWrite(RELAY_2, HIGH);
    pumpOn = true;
  } else if (jarak < 5) {
    digitalWrite(RELAY_2, LOW);
    pumpOn = false;
  }
  Serial.print("jarak ");
  Serial.print(jarak);
  Serial.print(" mm | "); 
}

void readHumidity() {
  if (!manualMode) {
    humid = analogRead(HUMID_PIN);
  } else {
    humid = manualHumidity;
  }

  if (humid > 80) {
    digitalWrite(RELAY_1, HIGH);
    sprinklerOn = true;
  } else if (humid < 20) {
    digitalWrite(RELAY_1, LOW);
    sprinklerOn = false;
  }
  Serial.print("Humid ");
  Serial.println(humid);
  delay(100);
}

// Fungsi notifikasi WebSocket ke semua klien
void notifyClients() {
  StaticJsonDocument<200> doc;
  doc["humidity"] = humid;
  doc["waterLevel"] = jarak;
  doc["flowRate"] = 0;  // Flow rate dummy (sesuaikan jika ada sensor debit)
  doc["sprinkler"] = sprinklerOn ? "ON" : "OFF";
  doc["pump"] = pumpOn ? "ON" : "OFF";
  doc["mode"] = manualMode ? "manual" : "auto";

  String data;
  serializeJson(doc, data);
  ws.textAll(data);
}

// Fungsi untuk menangani pesan WebSocket
void handleWebSocketMessage(void *arg, uint8_t *data, size_t len) {
  AwsFrameInfo *info = (AwsFrameInfo*)arg;
  if (info->final && info->index == 0 && info->len == len && info->opcode == WS_TEXT) {
    StaticJsonDocument<100> doc;
    DeserializationError error = deserializeJson(doc, data);

    if (!error) {
      String action = doc["action"];
      if (action == "start") {
        digitalWrite(RELAY_1, HIGH);
        sprinklerOn = true;
      } else if (action == "stop") {
        digitalWrite(RELAY_1, LOW);
        sprinklerOn = false;
      } else if (action == "suck") {
        digitalWrite(RELAY_2, HIGH);
        pumpOn = true;
      } else if (action == "stopSuck") {
        digitalWrite(RELAY_2, LOW);
        pumpOn = false;
      } else if (action == "setModeAuto") {
        manualMode = false;
      } else if (action == "setModeManual") {
        manualMode = true;
      } else if (action == "manualSettings" && manualMode) {
        manualHumidity = doc["humidity"];
        manualWater = doc["water"];
      }
    }
  }
}

// Callback event WebSocket
void onEvent(AsyncWebSocket *server, AsyncWebSocketClient *client, AwsEventType type, void *arg, uint8_t *data, size_t len) {
  if (type == WS_EVT_CONNECT) {
    Serial.println("WebSocket client connected");
  } else if (type == WS_EVT_DISCONNECT) {
    Serial.println("WebSocket client disconnected");
  } else if (type == WS_EVT_DATA) {
    handleWebSocketMessage(arg, data, len);
  }
}

// Fungsi untuk menyajikan halama n HTML
String processor(const String& var) {
  return String();
}

void setupServer() {
  // Rute untuk halaman utama
  server.on("/", HTTP_GET, [](AsyncWebServerRequest *request) {
    request->send_P(200, "text/html", R"rawliteral(
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sprinkler Otomatis</title>
  <style>
    body { font-family: Arial, sans-serif; text-align: center; margin: 0; padding: 0; background-color: #f3f4f6; }
    h1 { background-color: #007BFF; color: white; padding: 15px 0; margin: 0; }
    .container { max-width: 600px; margin: 20px auto; padding: 20px; background: #ffffff; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); border-radius: 10px; }
    .status span, .form-container h3 { display: block; font-size: 1.2em; margin: 10px 0; }
    .button-container button, .mode-container button { margin: 5px; padding: 10px 20px; font-size: 1em; border: none; border-radius: 5px; cursor: pointer; transition: background 0.3s; }
    button.start { background-color: #28a745; color: white; }
    button.stop { background-color: #dc3545; color: white; }
    .form-container input { margin: 5px; padding: 8px; font-size: 1em; }
    .form-container button { background-color: #007BFF; color: white; }
  </style>
</head>
<body>
  <h1>EcoSpray - Sprinkler Otomatis</h1>
  <div class="container">
    <div class="status">
      <span><strong>Kelembapan Tanah:</strong> <span id="humidity">0</span>%</span>
      <span><strong>Jumlah Air di Tangki:</strong> <span id="water">0</span> cm</span>
      <span><strong>Status Penyiraman:</strong> <span id="sprinklerStatus">OFF</span></span>
      <span><strong>Status Penyedotan:</strong> <span id="pumpStatus">OFF</span></span>
    </div>
    <div class="mode-container">
      <button class="start" onclick="sendCommand('setModeAuto')">Mode Otomatis</button>
      <button class="stop" onclick="sendCommand('setModeManual')">Mode Manual</button>
    </div>
    <div class="form-container">
      <h3>Pengaturan Manual</h3>
      <form id="manualControl" onsubmit="submitManualSettings(event)">
        <label for="manualHumidity">Kelembapan Tanah:</label>
        <input type="number" id="manualHumidity" name="manualHumidity" min="0" max="100" required>
        <label for="manualWater">Jarak Air (cm):</label>
        <input type="number" id="manualWater" name="manualWater" min="0" max="100" required>
        <button type="submit" class="start">Terapkan</button>
      </form>
    </div>
    <div class="button-container">
      <button class="start" onclick="sendCommand('start')">Mulai Penyiraman</button>
      <button class="stop" onclick="sendCommand('stop')">Hentikan Penyiraman</button>
      <button class="start" onclick="sendCommand('suck')">Mulai Penyedotan</button>
      <button class="stop" onclick="sendCommand('stopSuck')">Hentikan Penyedotan</button>
    </div>
  </div>
  <script>
    const ws = new WebSocket(`ws://${location.hostname}/ws`);
    let isManualMode = false;
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      document.getElementById("humidity").textContent = data.humidity;
      document.getElementById("water").textContent = data.waterLevel;
      document.getElementById("sprinklerStatus").textContent = data.sprinkler;
      document.getElementById("pumpStatus").textContent = data.pump;
      isManualMode = data.mode === "manual";
    };

    function sendCommand(action) {
      ws.send(JSON.stringify({ action }));
    }

    function submitManualSettings(event) {
      event.preventDefault();
      if (isManualMode) {
        const manualHumidity = document.getElementById("manualHumidity").value;
        const manualWater = document.getElementById("manualWater").value;
        ws.send(JSON.stringify({ action: "manualSettings", humidity: manualHumidity, water: manualWater }));
      } else {
        alert("Harap aktifkan mode manual terlebih dahulu.");
      }
    }
  </script>
</body>
</html>
    )rawliteral", processor);
  });

  ws.onEvent(onEvent);
  server.addHandler(&ws);
  server.begin();
}

void setup() {
  Serial.begin(115200);
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
  pinMode(RELAY_1, OUTPUT);
  pinMode(RELAY_2, OUTPUT);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Menghubungkan ke WiFi...");
  }
  Serial.println("WiFi Terhubung!");
  Serial.print("Alamat IP: ");
  Serial.println(WiFi.localIP());
  setupServer();
}

void loop() {
  readHumidity();
  readUltrasonic();
  notifyClients();
}
