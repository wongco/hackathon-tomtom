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
 * desc: get a list of fence reports
 * input (request body): { longitude, latitude }
 * optional input (request body): { range }
 */
router.post('/:projectId/report', async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const { longitude, latitude, range } = req.body;

    const apiResult = await axios({
      url: `${API_BASE}/report/${projectId}?key=${API_KEY}&point=${longitude},${latitude}&range=${range ||
        100}`,
      method: 'get'
    });

    const rawInsideFences = apiResult.data.inside.features;
    const rawOutsideFences = apiResult.data.outside.features;

    const inside = rawInsideFences.map(fence => {
      const { id, name, distance, properties } = fence;
      return { id, name, distance, ...properties };
    });

    const outside = rawOutsideFences.map(fence => {
      const { id, name, distance, properties } = fence;
      return { id, name, distance, ...properties };
    });

    return res.json({
      fences: {
        inside,
        outside
      }
    });
  } catch (error) {
    console.log(error.response.data.message);
    return next(error);
  }
});

module.exports = router;
