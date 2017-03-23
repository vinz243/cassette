import {createStructuredSelector} from 'reselect';
import axios from 'axios';

const SCAN_LIBRARIES = 'cassette/sidebar/SCAN_LIBRARIES';
const WAIT_SCAN      = 'cassette/sidebar/WAIT_SCAN';

export const NAME = 'sidebar';

const initialState = {
  scanning: false,
  scanId: -1
};

export default function reducer(state = initialState, action) {
  switch(action.type) {
    case WAIT_SCAN:
      return Object.assign({}, state, {
        scanning: false
      });
    case SCAN_LIBRARIES:
      return Object.assign({}, state, {
        scanning:  true,
        scanId: action.scanId
      });
    default:
      return state;
  }
}

const sidebar = (state) => state[NAME];

export const selector = createStructuredSelector({
  sidebar
});

function scanLibraries () {
  return axios.post('/api/v2/scans', {
    mode: 'all'
  }).then((res) => ({
    type: SCAN_LIBRARIES,
    scanId: res.data._id
  }));
}
function waitScan(scanId) {
  return new Promise((resolve, reject) => {
    function wait (res) {
      if (res.data.statusCode !== 'PENDING')
        return resolve({
          type: WAIT_SCAN,
          res
        });
      setTimeout(() => {
        axios.get(`/api/v2/scans/${scanId}`).then(wait);
      }, 700);
    }
    wait({
      data: {
        statusCode: 'PENDING'
      }
    });
  });
}



export const actionCreators = {
  waitScan, scanLibraries
};
