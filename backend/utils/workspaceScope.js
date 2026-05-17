/** Tasker workspace: personal tasks and joined projects (including admin on /login). */
const getTaskFilterForWorkspace = (user) => ({ assignedTo: user._id });

const getProjectFilterForWorkspace = (user) => ({ members: user._id });

module.exports = {
  getTaskFilterForWorkspace,
  getProjectFilterForWorkspace,
};
