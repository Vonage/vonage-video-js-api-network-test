require('dotenv').config()
const { Vonage } = require('@vonage/server-sdk');
const Promise = require('promise');
const fse = require('fs-extra');
const fs = require('fs');
const applicationId = process.env.TEST_APPLICATION_ID;


async function createSessionAndToken({applicationId, privateKey}) {
  const vonage = new Vonage({
    applicationId,
    privateKey,
  });
  try {
    const session = await vonage.video.createSession({ mediaMode: 'routed' });
    const token = vonage.video.generateClientToken(session.sessionId);
    const { sessionId } = session;
    return { applicationId, sessionId, token };
  } catch(e) {
    console.error(e);
    throw e;
  }


}

function writeCredentials(credentialsArray) {
  const [primary, faultyLogging, faultyApi] = credentialsArray;
  const credentials = { primary, faultyLogging, faultyApi };
  return fse.outputJson('./test/credentials.json', credentials);
}

function generateCredentials(){
  const privateKey = fs.readFileSync('./private.key');
  const create = () => createSessionAndToken({applicationId, privateKey});

  Promise.all([create(), create(), create()])
    .then(writeCredentials)
    .then((results) => console.info('Generated session credentials for test.'))
    .catch(e => console.error('Failed to generate test credentials', e));
}

generateCredentials();
