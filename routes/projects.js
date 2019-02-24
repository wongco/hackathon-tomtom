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

    const fenceIdsPromises = fenceIds.map(fenceId => {
      const apiResultPromise = axios({
        url: `${API_BASE}/fences/${fenceId}?key=${API_KEY}`,
        method: 'get'
      });
      return apiResultPromise;
    });

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

    // return res.json({ data });
    return res.json(apiResult.data);
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
