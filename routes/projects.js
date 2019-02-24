// npm modules
const express = require('express');
const router = new express.Router();
const axios = require('axios');

const { API_BASE, ADMIN_KEY, API_KEY } = require('../config');

/** Base Route: /projects */

/** GET - /projects
 * desc: get a list of projects
 */
router.get('/', async (req, res, next) => {
  try {
    const apiResult = await axios({
      url: `${API_BASE}/projects?key=${API_KEY}`,
      method: 'get'
    });

    return res.json(apiResult.data);
  } catch (error) {
    return next(error);
  }
});

/** POST - /projects
 * desc: add a project
 */
router.post('/', async (req, res, next) => {
  try {
    const { name } = req.body;
    const apiResult = await axios({
      url: `${API_BASE}/projects/project?key=${API_KEY}&adminKey=${ADMIN_KEY}`,
      method: 'post',
      data: {
        name
      }
    });

    return res.json(apiResult.data);
  } catch (error) {
    return next(error);
  }
});

/** GET - /projects/:projectId
 * desc: update the name of a specific Project
 */
router.get('/:projectId', async (req, res, next) => {
  try {
    const { projectId } = req.params;

    const apiResult = await axios({
      url: `${API_BASE}/projects/${projectId}?key=${API_KEY}`,
      method: 'get'
    });

    // get individual fence data and append to final json results
    const { fences } = apiResult.data;
    const fenceIds = fences.map(fenceObj => fenceObj.id);

    // build fenceIdPromise Array
    const fenceIdsPromises = fenceIds.map(fenceId => {
      const apiResultPromise = axios({
        url: `${API_BASE}/fences/${fenceId}?key=${API_KEY}`,
        method: 'get'
      });
      return apiResultPromise;
    });

    // obtain fenceResult Details and parse into clean data
    const fenceResults = await Promise.all(fenceIdsPromises);
    const fenceCleanData = fenceResults.map(fenceData => fenceData.data);

    const { id, name, defaultObjects } = apiResult.data;
    return res.json({ id, name, fences: fenceCleanData, defaultObjects });
  } catch (error) {
    return next(error);
  }
});

/** PUT - /projects/:projectId
 * desc: update the name of a specific Project
 */
router.put('/:projectId', async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const { name } = req.body;
    const apiResult = await axios({
      url: `${API_BASE}/projects/${projectId}?key=${API_KEY}&adminKey=${ADMIN_KEY}`,
      method: 'put',
      data: {
        name
      }
    });

    return res.json(apiResult.data);
  } catch (error) {
    return next(error);
  }
});

/** DELETE - /projects/:projectId
 * desc: delete a specific Project
 */
router.delete('/:projectId', async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const apiResult = await axios({
      url: `${API_BASE}/projects/${projectId}?key=${API_KEY}&adminKey=${ADMIN_KEY}&dryRun=false`,
      method: 'delete'
    });

    return res.json(apiResult.data);
  } catch (error) {
    return next(error);
  }
});

/** POST - /:projectId/fence
 * desc: add a geofence to a specific project
 * { // req body data: note coordinates are [long, lat]
      "name": "The Bird",
      "type": "Feature",
      "geometry": {
        "radius": 400,
        "type": "Point",
        "shapeType": "Circle",
        "coordinates": [
          -122.400103,
          37.787246
        ]
      },
      "properties": {
        "random":"thebirdddd!"
      }
    }
 */
router.post('/:projectId/fence', async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const data = req.body;

    const apiResult = await axios({
      url: `${API_BASE}/projects/${projectId}/fence?key=${API_KEY}&adminKey=${ADMIN_KEY}`,
      method: 'post',
      data
    });

    return res.json(apiResult.data);
  } catch (error) {
    console.log(error.response.data.message);
    return next(error);
  }
});

/** POST - /projects/:projectId/report
 * desc: get a list of projects
 * input (request body): { coordinates: { longitude, latitude }}
 */
// router.get('/:projectId/report', async (req, res, next) => {
//   try {
//     const { projectId } = req.params;
//     const { longitude, latitude } = req.body;

//     console.log(longitude, latitude, projectId);
//     // hit tom tom api with report request

//     // parse inside and outside ids

//     // get details from tom tom for inside and outside ids

//     //     "Report" GET request syntax:
//     // https://api.tomtom.com/geofencing/1/report/projectId?key=apiKey&point=longitude,latitude
//     // (fill in projectId, apiKey, longitude, latitude)

//     // response.inside.features is an array of overlapping geofences (and response.outside.features is an array of non-overlapping geofences)

//     // const apiResult = await axios({
//     //   url: `${API_BASE}/reports/projects?key=${API_KEY}`,
//     //   method: 'get'
//     // });

//     // return res.json(apiResult.data);
//     return res.json({
//       test: 'woooo'
//     });
//   } catch (error) {
//     return next(error);
//   }
// });

module.exports = router;
