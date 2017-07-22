/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"]*/
/**
 * This sample demonstrates a simple skill built with the Amazon Alexa Skills
 * nodejs skill development kit.
 * This sample supports multiple lauguages. (en-US, en-GB, de-DE).
 * The Intent Schema, Custom Slots and Sample Utterances for this skill, as well
 * as testing instructions are located at https://github.com/alexa/skill-sample-nodejs-fact
 **/

'use strict';

const Alexa = require('alexa-sdk');
const https = require('https');

const APP_ID = "amzn1.ask.skill.195f5324-0677-43f3-a88b-45ed044474ac";

const languageStrings = {
    'en': {
        translation: {
            SKILL_NAME: 'Tyke POD - NASA\'s Astronomy Picture of the Day',
            GET_FACT_MESSAGE: "Here is the Astronomy picture of the day from NASA, ",
            HELP_MESSAGE: 'Welcome to Tyke POD!! To use this skill, you can say, Tyke POD to Deetya or Tyke POD Havisha. Please start over.',
            // HELP_REPROMPT: 'What can I help you with?',
            STOP_MESSAGE: 'Goodbye!',
        },
    },
    'en-US': {
        translation: {
            SKILL_NAME: 'Tyke POD - NASA\'s Astronomy Picture of the Day',
            GET_FACT_MESSAGE: "Here is the Astronomy picture of the day from NASA, ",
            HELP_MESSAGE: 'Welcome to Tyke POD!! To use this skill, you can say, Tyke POD to Deetya or Tyke POD Havisha. Please start over.',
            // HELP_REPROMPT: 'What can I help you with?',
            STOP_MESSAGE: 'Goodbye!',
        },
    },
};

const handlers = {
    'LaunchRequest': function () {
        this.emit('GetFact');
    },
    'talkIntent': function () {
        this.emit('GetFact');
    },
    'GetFact': function () {
        // Get a random space fact from the space facts list
        // Use this.t() to get corresponding language data
        console.log(this.event.request.intent);
        if(this.event.request.intent === undefined ){
            this.emit('AMAZON.HelpIntent');
        }
        var options = {
            host: 'api.nasa.gov',
            port: 443,
            path: '/planetary/apod?api_key=hTII0m6T0Kst0VReHN0CjCytPMMMyyqtNCmy5SHc',
            method: 'GET'
        };
        var kidName = this.event.request.intent.slots.kidsName.value;
        console.log ("Kids Name received:"+kidName);
        httpsGet(options,kidName, (myResult) => {
                console.log("sent     : " + options);
                console.log("received : " + myResult);

                console.log("Kid Name:" + myResult.kidName);
                if(undefined === myResult.kidName){
                    kidName = "Tyke";
                }
                var apodMessage= myResult.explanation;
                var imageObj = {
                    smallImageUrl: myResult.url,
                    largeImageUrl: myResult.url
                };
                const speechOutput = "Hello " + kidName + ", " + this.t('GET_FACT_MESSAGE') + apodMessage;
                this.emit(':tellWithCard', speechOutput, myResult.title, apodMessage,imageObj);

            }
        );
    },
    'AMAZON.HelpIntent': function () {
        const speechOutput = this.t('HELP_MESSAGE');
        const reprompt = this.t('HELP_MESSAGE');
        this.emit(':tell', speechOutput);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', this.t('STOP_MESSAGE'));
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', this.t('STOP_MESSAGE'));
    },
};

exports.handler = function (event, context) {
    const alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    // To enable string internationalization (i18n) features, set a resources object.
    alexa.resources = languageStrings;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

function httpsGet(options, kidName, callback) {
    var req = https.request(options, res => {
        res.setEncoding('utf8');
        var returnData = "";

        res.on('data', chunk => {
            returnData = returnData + chunk;
        });

        res.on('end', () => {
            // we have now received the raw return data in the returnData variable.
            // We can see it in the log output via:
            // console.log(JSON.stringify(returnData))
            // we may need to parse through it to extract the needed data
            //console.log(kidName);
            var pop = JSON.parse(returnData);
            pop.kidName = kidName;
            callback(pop);  // this will execute whatever function the caller defined, with one argument

        });

    });
    req.end();
}
