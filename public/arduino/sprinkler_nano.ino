const int trigPin = 3;
const int echoPin = 2;
const int soilMoisturePin = A0;
const int relaysedotPin = 8; // Pin untuk relay sedot
const int relaysemprotPin = 9; // Pin untuk relay semprot

void setup() {
  Serial.begin(9600);
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
  pinMode(soilMoisturePin, INPUT);
  pinMode(relaysedotPin, OUTPUT);
  pinMode(relaysemprotPin, OUTPUT);

  // Pastikan relay dalam kondisi mati saat startup
  digitalWrite(relaysedotPin, LOW);
  digitalWrite(relaysemprotPin, LOW);
}

void loop() {
  long duration;
  int distance;
  int soilMoistureValue;

  // Baca dan hitung jarak dari sensor ultrasonik
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);
  duration = pulseIn(echoPin, HIGH);
  distance = duration * 0.343 / 2;

  // Baca nilai kelembaban tanah dari sensor soil moisture
  soilMoistureValue = analogRead(soilMoisturePin);

  // Kontrol relaysedot berdasarkan jarak
  if (distance < 27) {
    digitalWrite(relaysedotPin, HIGH); // Nyalakan relay sedot
  } else if (distance > 84) {
    digitalWrite(relaysedotPin, LOW); // Matikan relay sedot
  }

  // Kontrol relaysemprot berdasarkan kelembaban tanah
  if (soilMoistureValue > 1000) {
    digitalWrite(relaysemprotPin, HIGH); // Nyalakan relay semprot
  } else if (soilMoistureValue < 990) {
    digitalWrite(relaysemprotPin, LOW); // Matikan relay semprot
  }

  // Kirim data ke ESP32 dalam format <D:distance,S:soilMoistureValue>
  Serial.print("<D:");
  Serial.print(distance);
  Serial.print(",S:");
  Serial.print(soilMoistureValue);
  Serial.println(">");

  // Delay sebelum pembacaan berikutnya
  delay(200);
}
