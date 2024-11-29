# IoT ESP32 forraskod
```cpp
#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <HTTPClient.h>

// WiFi adatok
const char* ssid = "#Rivi iPhone-ja";
const char* password = "B055man69";

// URL, ahova a GET kérést küldöd
const char* serverName = "https://youngest-orelee-rivasz-02920cb7.koyeb.app";

#define BUTTON_PIN_13 13  // 1
#define BUTTON_PIN_12 12  // 2
#define BUTTON_PIN_14 14  // 3
#define BUTTON_PIN_27 27  // 4
#define BUTTON_PIN_26 26  // reset
#define BUTTON_PIN_25 25  // send

String belepesiAzonosito = "";

WiFiClientSecure client;  // Biztonságos kapcsolat
HTTPClient http;

int szamlalo = 0;

void setup() {
  Serial.begin(115200);  // Serial Monitor indítása
  connectWiFi();

  // Gombok inicializálása
  pinMode(BUTTON_PIN_13, INPUT_PULLUP);
  pinMode(BUTTON_PIN_12, INPUT_PULLUP);
  pinMode(BUTTON_PIN_14, INPUT_PULLUP);
  pinMode(BUTTON_PIN_27, INPUT_PULLUP);
  pinMode(BUTTON_PIN_26, INPUT_PULLUP);
  pinMode(BUTTON_PIN_25, INPUT_PULLUP);

  // SSL tanúsítvány ellenőrzés kikapcsolása
  client.setInsecure();
}

void loop() {
  int buttonState13 = digitalRead(BUTTON_PIN_13);
  int buttonState12 = digitalRead(BUTTON_PIN_12);
  int buttonState14 = digitalRead(BUTTON_PIN_14);
  int buttonState27 = digitalRead(BUTTON_PIN_27);
  int buttonState26 = digitalRead(BUTTON_PIN_26);
  int buttonState25 = digitalRead(BUTTON_PIN_25);

  // Gombkezelés az elsőtől a negyedik elemig
  if (buttonState13 == LOW) processButton(1);
  if (buttonState12 == LOW) processButton(2);
  if (buttonState14 == LOW) processButton(3);
  if (buttonState27 == LOW) processButton(4);

  // Reset
  if (buttonState26 == LOW) {
    szamlalo = 0;
    Serial.println("Reset");
    belepesiAzonosito = "";
    sendHttpRequest("/numbers/reset");
    delay(200);  // Zaj szűrés (debounce)
  }

  // Check
  if (buttonState25 == LOW && szamlalo != 0) {
    Serial.println("Send check request");
    sendHttpRequest("/numbers/check");
    delay(200);  // Zaj szűrés (debounce)
  }
}

// WiFi kapcsolat létrehozása
void connectWiFi() {
  WiFi.begin(ssid, password);
  Serial.println("Connecting to WiFi...");
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.print(".");
  }
  Serial.println("\nWiFi connected!");
  Serial.print("ESP32 IP Address: ");
  Serial.println(WiFi.localIP());
}

// Gombnyomás feldolgozása
void processButton(int value) {
  szamlalo++;
  Serial.printf("Button %d pressed\n", value);
  belepesiAzonosito += String(value);

  String route;
  switch (szamlalo) {
    case 1: route = "/numbers/first/" + String(value); break;
    case 2: route = "/numbers/second/" + String(value); break;
    case 3: route = "/numbers/third/" + String(value); break;
    case 4: route = "/numbers/fourth/" + String(value); break;
    default: return;
  }

  sendHttpRequest(route);
  delay(200);  // Zaj szűrés (debounce)
}

// HTTP GET kérés küldése és válasz kiírása
void sendHttpRequest(String route) {
  if (WiFi.status() == WL_CONNECTED) {
    String fullUrl = String(serverName) + route;

    Serial.print("Connecting to: ");
    Serial.println(fullUrl);

    if (http.begin(client, fullUrl)) {
      http.setTimeout(15000);  // 15 másodperces timeout

      int httpResponseCode = http.GET();

      if (httpResponseCode > 0) {
        String payload = http.getString();
        Serial.printf("HTTP Response Code: %d\n", httpResponseCode);
        Serial.println("Response Payload: ");
        Serial.println(payload);
      } else {
        Serial.printf("Error on HTTP request: %d\n", httpResponseCode);
      }

      http.end();  // HTTP kapcsolat lezárása
    } else {
      Serial.println("Unable to connect to server");
    }
  } else {
    Serial.println("WiFi disconnected. Reconnecting...");
    connectWiFi();
  }
}
```
