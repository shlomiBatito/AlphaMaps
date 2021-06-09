<template>
  <v-row justify="center">
    <v-dialog
      v-model="dialog"
      max-width="600px"
    >

      <v-card >
        <v-card-title class="justify-center" v-show="!firstShow">
          <h2><b> {{chosenEvent}}</b></h2>
        </v-card-title>
        <v-card-text class="justify-center aligning">
        <v-select
                  :items="['ירי', 'דקירה', 'חטיפה', 'תאונה']"
                  label="סוג אירוע*"
                  required
                  v-model="chosenEvent"
                  v-show="firstShow"
                  @change= "changeVisible(), configureLines()"
                ></v-select>
          <v-container class="inputs-container">
          <div v-for="currLine in lines" :key="currLine.id">
            <v-row >
              <v-col
                cols="12"
                sm="6"
                md="4"
              >
               
              </v-col>
              
              <v-col
                cols="12"
                sm="6"
                md="4"
              >
              
                
              <v-text-field
                  :value="value"
                  class="justify-center centered-input "
                  v-model="formData[currLine.id]"
                ></v-text-field>   
              </v-col>
              <v-col
                cols="12"
                md="4"
                class="padding"
              >
               <h2 class="padding"><b> : {{currLine.value}}</b></h2>
              </v-col>

            </v-row>
            </div>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="black"
            text
            @click="closeDialog()"
          >
            Close
          </v-btn>
          <v-btn
            color="black"
            text
            @click="closeDialog(), deliverData()"

          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import accidentFields from "./../data/accidentFields.json"
import kidnappingFields from "./../data/kidnappingFields.json"
import shootingFields from "./../data/shootingFields.json"
import stabbingFields from "./../data/stabbingFields.json"
// import axios from "axios";

  export default {
    data: () => ({
      dialog: true,
      firstShow: true,
      chosenEvent: "",
      lines: [], 
      nothing: "",
      value: "",
      formData: {}
    }),
    props: {
      coords: Array
    },
    methods: {
      changeVisible() {
        this.firstShow = !this.firstShow;
      },
      configureLines() {

        switch(this.chosenEvent) {
          case "חטיפה":
          for (const [key, value] of Object.entries(kidnappingFields)) {
            this.nothing = key;
            this.lines.push({
              "id": this.lines.length,
              "value": value});
          }
          break;

          case "תאונה":
          for (const [key, value] of Object.entries(accidentFields)) {
            this.nothing = key;
           this.lines.push({
              "id": this.lines.length,
              "value": value});
          }
          break;

          case "ירי": 
             for (const [key, value] of Object.entries(shootingFields)) {
            this.nothing = key;
            this.lines.push({
              "id": this.lines.length,
              "value": value});
             }
          break;

          case "דקירה":
            for (const [key, value] of Object.entries(stabbingFields)) {
            this.nothing = key;
            this.lines.push({
              "id": this.lines.length,
              "value": value});
            }
          break;
        }

        },
         async deliverData() {
          let objToReturn = {};

          switch(this.chosenEvent) {
          case "חטיפה":
          var count = 0;
          for (const [key, value] of Object.entries(kidnappingFields)) {

            if(key.includes("date")) {
              objToReturn[key] = new Date(this.formData[count]).toISOString().toString()
            } else {
              objToReturn[key] = this.formData[count]
            }

            this.nothing = value;
            count ++;
          }

          objToReturn["lat"] = this.coords[0];
          objToReturn["lon"] = this.coords[1];
          objToReturn["type"] = "kidnapping_event";

          break;

          case "תאונה":
          count = 0;
          for (const [key, value] of Object.entries(accidentFields)) {

            if(key.includes("date")) {
              objToReturn[key] = new Date(this.formData[count]).toISOString().toString()
            } else {
            objToReturn[key] = this.formData[count]
            }
            this.nothing = value;
            count ++;
          }

          objToReturn["lat"] = this.coords[0];
          objToReturn["lon"] = this.coords[1];
          objToReturn["type"] = "accident_event";

          break;

          case "ירי": 
          count = 0;
            for (const [key, value] of Object.entries(shootingFields)) {
              if(key.includes("date")) {
              objToReturn[key] = new Date(this.formData[count]).toISOString().toString()
            } else {
            objToReturn[key] = this.formData[count]
            }
            this.nothing = value;
            count ++;
          }

          objToReturn["lat"] = this.coords[0];
          objToReturn["lon"] = this.coords[1];
          objToReturn["type"] = "shooting_event";

          break;

          case "דקירה":
            count = 0;
            for (const [key, value] of Object.entries(stabbingFields)) {
              if(key.includes("date")) {
              objToReturn[key] = new Date(this.formData[count]).toISOString().toString()
            } else {
            objToReturn[key] = this.formData[count]
            }
            this.nothing = value;
            count ++;
          }

          objToReturn["lat"] = this.coords[0];
          objToReturn["lon"] = this.coords[1];
          objToReturn["type"] = "stabbing_event";

          break;
        }

          console.log(objToReturn);

     fetch('http://police-server-securityapp2.apps.openforce.openforce.biz/map/addEvent', {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json'
      },
    referrerPolicy: 'no-referrer',
    body:  JSON.stringify({...objToReturn, reported_by: 1})
    // body: JSON.stringify({
    //   stabber:objToReturn.stabber,
    //   weapon_type:objToReturn.weapon_type,
    //   injured_count:objToReturn.injured_count,
    //   date:objToReturn.date,
    //   reported_by:1,
    //   injured_type:objToReturn.injured_type,
    //   lon:objToReturn.lon,
    //   lat:objToReturn.lat,
    //   type: objToReturn.type
    // })
    })

      // axios.post('http://police-server-securityapp2.apps.openforce.openforce.biz/map/addEvent', objToReturn)
      // .then((res) => {
      //   console.log('Login suceeded! ' + res)
      // })
      // .catch((err) => {
      //   console.error('Login failed.' + err);
      // })

       this.$emit('dataSent')
         
        },
        closeDialog() {
          this.dialog = false;
          this.$emit('closeDialog', false);
        }
      },
    }

</script>

<style>
.v-card > *:last-child:not(.v-btn):not(.v-chip) { 
  background-color: #9eafd6;
}

.v-text-field.centered-input .v-label {
  left: 50% !important;
  transform: translateX(-50%);
  &.v-label--active {
    transform: translateY(-18px) scale(.75) translateX(-50%);
  }
}

.inputs-container {
  .col-12 {
    padding-top: 0;
    padding-bottom: 0;
  }
  .theme--light.v-input {
    padding-top: 0;
  }
  .v-input__slot {
    margin-bottom: 0;
  }
}

.padding {
    padding: 0;
    margin: auto;
}

.aligning {
  align-self:
}

.v-text-field {
  padding-top: 0;
  margin:auto;
}

.v-dialog > .v-card > .v-card__text {
    background-color: #9eafd6;
}

.v-card > *:first-child:not(.v-btn):not(.v-chip), .v-card > .v-card__progress + *:not(.v-btn):not(.v-chip) {
     background-color: #9eafd6;
}
</style>