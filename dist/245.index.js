export const id = 245;
export const ids = [245];
export const modules = {

/***/ 2245:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  SlackBotWebhook: () => (/* binding */ SlackBotWebhook),
  slackBotWebhook: () => (/* binding */ slackBotWebhook)
});

// EXTERNAL MODULE: ./src/types/generated.ts
var generated = __webpack_require__(8428);
// EXTERNAL MODULE: ./node_modules/lodash/lodash.js
var lodash = __webpack_require__(2356);
;// CONCATENATED MODULE: ./src/utils/slack-actions.ts

const validOrThrow = (param) => {
    if (!param) {
        throw new Error(`Parameter ${param} is required`);
    }
};
const getDailyTs = async (client, channel) => {
    const history = await client.conversations.history({
        channel: channel
    });
    const recentMsg = history.messages?.find(msg => {
        msg.text?.includes('Daily PRs for review');
    });
    return recentMsg?.ts;
};
const replacePlaceholders = (message, placeholders) => {
    const filteredHolders = (0,lodash.pickBy)(placeholders, value => value !== undefined);
    return Object.entries(filteredHolders).reduce((acc, [key, value]) => {
        return acc.replace(new RegExp(`{{${key}}}`, 'g'), value);
    }, message);
};
const automatedPr = async ({ message_template, channel, check_daily_thread, message_tag_id, message_tag_name, commited_version, client, bttn_link }) => {
    [channel, message_tag_id, message_tag_name, commited_version].forEach(i => validOrThrow(i));
    const thread_ts = check_daily_thread ? getDailyTs(client, channel) : undefined;
    const placeHolders = {
        VERSION: commited_version,
        TEAM_ID: message_tag_id,
        TEAM_NAME: message_tag_name,
        PR_URL: bttn_link
    };
    const replacedMesage = replacePlaceholders(message_template, placeHolders);
    const messageObj = JSON.parse(replacedMesage);
    const payload = {
        ...messageObj,
        channel,
        thread_ts
    };
    return await client.chat.postMessage(payload);
};

// EXTERNAL MODULE: ./node_modules/@slack/web-api/dist/index.js
var dist = __webpack_require__(5105);
// EXTERNAL MODULE: external "fs"
var external_fs_ = __webpack_require__(9896);
var external_fs_default = /*#__PURE__*/__webpack_require__.n(external_fs_);
;// CONCATENATED MODULE: ./src/helpers/send-slack-message.ts
/*
Copyright 2021 Expedia, Inc.
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
https://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/




const TEMPLATES = {
    'automated-pr': {
        dir: '../templates/json/automated-pr.json',
        action: automatedPr
    }
};
class SlackBotWebhook extends generated/* HelperInputs */.m {
    slack_token = '';
    message_template = '';
}
const slackBotWebhook = async ({ message_template, slack_token, ...varags }) => {
    const template = TEMPLATES[message_template];
    if (!template) {
        throw new Error(`Template ${message_template} not found`);
    }
    const client = new dist.WebClient(slack_token);
    const { dir, action } = template;
    const payloadTemplate = external_fs_default().readFileSync(dir, 'utf8');
    return action({ message_template: payloadTemplate, client, ...varags });
};


/***/ }),

/***/ 8428:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   m: () => (/* binding */ HelperInputs)
/* harmony export */ });
/*
Copyright 2021 Expedia, Inc.
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
    https://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
class HelperInputs {
}


/***/ })

};

//# sourceMappingURL=245.index.js.map