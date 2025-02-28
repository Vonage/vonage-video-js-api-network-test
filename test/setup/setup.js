require('dotenv').config()
const OpenTok = require('opentok');
const Promise = require('promise');
const fse = require('fs-extra');
const applicationId = process.env.TEST_APPLICATION_ID
const apiSecret = process.env.TEST_API_SECRET


function createSessionAndToken({ applicationId, apiSecret }) {
  return new Promise((resolve, reject) => {
    const opentok = new OpenTok(applicationId, apiSecret);
    opentok.createSession({ mediaMode: 'routed' }, (error, session) => {
      if (error) {
        reject(error);
      } else {
        const token = opentok.generateToken(session.sessionId);
        const { sessionId } = session;
        resolve({ applicationId, sessionId, token });
      }
    });
  });
}

function writeCredentials(credentialsArray) {
  const [primary, faultyLogging, faultyApi] = credentialsArray;
  const credentials = { primary, faultyLogging, faultyApi };
  return fse.outputJson('./test/credentials.json', credentials);
}

function generateCredentials(){
  const create = () => createSessionAndToken({ applicationId, apiSecret })

  Promise.all([create(), create(), create()])
    .then(writeCredentials)
    .then((results) => console.info('Generated session credentials for test.'))
    .catch(e => console.error('Failed to generate test credentials', e));
}

generateCredentials();
