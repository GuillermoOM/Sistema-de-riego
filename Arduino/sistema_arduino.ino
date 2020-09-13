#include <DHT.h>
#include <DHT_U.h>

#define DHTPIN 6
#define DHTTYPE DHT11

int hum;
char v;
DHT dht(DHTPIN, DHTTYPE);

void setup() {
  pinMode(3, OUTPUT); //Relevador
  //pinMode(6, INPUT); //Humedad
  Serial.begin(9600);
  dht.begin();
}

void loop() {
  if(Serial.available() > 0){
    v = Serial.read();
    if(v == 's'){ //abrir valvula
      digitalWrite(3, HIGH);
    }
    if(v == 'r'){ //cerrar valvula
      digitalWrite(3, LOW);
    }
    if(v == 'a'){ //pedido datos sensores
        hum = 100 * analogRead(A0) / 1024;
        float t = dht.readTemperature();
        Serial.print(t);
        Serial.print(",");
        Serial.println(hum);
    }
  }
  delay(10);
}
