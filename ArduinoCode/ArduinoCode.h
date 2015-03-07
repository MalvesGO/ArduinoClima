/*BIBLIOTECAS*/

#include <dht.h>
#define SENSOR_DHT      8

/*INSTANCIANDO BIBLIOTECAS*/

dht     lib_dht;

/*FIM - INSTANCIANDO BIBLIOTECAS*/



/*OUTROS*/

String inputString      = "";
boolean stringComplete  = false;

/*FIM OUTROS*/ 

void setup(){

  Serial.begin(9600);
}

void loop(){

  int chk = lib_dht.read22(SENSOR_DHT);

  serialEvent();


  Serial.print("{");
  Serial.print("\"temperatura\" : \"");
  Serial.print((int)lib_dht.temperature, 1);
  Serial.print("\",\"umidade\" : \"");
  Serial.print((int)lib_dht.humidity, 1);
  Serial.println("\"}");
  delay(600);
}


void serialEvent() {
  while (Serial.available()) {
    char inChar = (char)Serial.read();
    inputString += inChar;
    if (inChar == '\r') {
      stringComplete = true;
    }
  }
}