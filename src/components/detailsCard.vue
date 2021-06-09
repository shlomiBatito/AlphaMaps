<template>
<v-app>
<div class="text-center">
    <v-dialog
      v-model="dialog"
      width="400"
      height="900"
    >
      <v-card>
          <v-card-actions>
          <v-btn
            color="primary"
            text
            @click="closeDialog()"
          >
            X
          </v-btn>
        </v-card-actions>
            <v-card-text v-html="detailsText" dir="rtl" class="sizeText">
          </v-card-text>
        <v-divider></v-divider>

      </v-card>
    </v-dialog>
  </div>
</v-app>
</template>

<script>
import accidentFields from "./../data/accidentFields.json"
import kidnappingFields from "./../data/kidnappingFields.json"
import shootingFields from "./../data/shootingFields.json"
import stabbingFields from "./../data/stabbingFields.json"

export default {
   data () {
      return {
        dialog: true
      }
    },
    props: {
       obj: Object
    },
    computed: {
    detailsText() {
      let text = '';

      if (this.obj.kidnapper) {
            text = `<b>אירוע חטיפה</b><br/>`
            
            for (const [key, value] of Object.entries(kidnappingFields)) {
              text += `${value}: ${this.obj[key]}<br/>`;
            }

    } else if(this.obj.shooter){
            text = `<b>אירוע ירי</b><br/>`
            
            for (const [key, value] of Object.entries(shootingFields)) {
              text += `${value}: ${this.obj[key]}<br/>`;
            }

    } else if(this.obj.driver){
                    text = `<b>תאונה</b><br/>`
            
            for (const [key, value] of Object.entries(accidentFields)) {
              text += `${value}: ${this.obj[key]}<br/>`;
            }

    } else if(this.obj.stabber){
      text = `<b>אירוע דקירה</b><br/>`
            
            for (const [key, value] of Object.entries(stabbingFields)) {
               text += `${value}: ${this.obj[key]}<br/>`;
            }

    } else {
      text = `פרטי אירוע זה מסווגים`;
    }

    return text;
    },
    },
    methods: {
      closeDialog() {
          this.dialog = false;
          this.$emit('closeDialog', false);
        }
    }
    }  
</script>

<style>
.sizeText {
    font-size: 1.5 px;
    font-family: system-ui;
}

.v-dialog > .v-card > .v-card__text {
    background-color: #9eafd6;
}

.v-card > *:first-child:not(.v-btn):not(.v-chip), .v-card > .v-card__progress + *:not(.v-btn):not(.v-chip) {
     background-color: #9eafd6;
}

.v-card__text.sizeText {
    font-size: large;
}


</style>