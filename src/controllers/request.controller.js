const ConnectionRepository = require("../repository/connection.repository");
const connectionRepo = new ConnectionRepository();

const sendRequest = async (req, res) => {
  try {
    const { userId: from } = req.user;
    const { userId: to } = req.params;
    const { status } = req.params;
    if (!from || !to || !status)
      return res.status(404).json({
        message: "Invalid connection request",
      });
    if (from === to)
      return res.status(404).json({
        message: "You cannot send a connection request to yourself",
      });
    if (!["Interested", "Ignored"].includes(status))
      return res.status(400).json({
        message: "Invalid status type",
      });
    const connection = await connectionRepo.createConnection(from, to, status);
    const receiverName = connection.to.firstName + " " + connection.to.lastName;
    return res.status(200).json({
      message: `Request to ${receiverName}, sent successfully `,
      connection,
    });
  } catch (error) {
    return res.status(500).json({
      message:
        error?.errors?.status?.message ||
        error?.message ||
        "Error while sending request.",
      error: error?.errors,
    });
  }
};

const reviewRequest = async (req, res) => {
  try {
    const { userId: to } = req.user;
    if (!to)
      return res.status(404).json({
        message: "User is not logged in",
      });
    const { action, connectionId } = req.params;
    if (!action || !connectionId)
      return res.status(400).json({
        message: "Invalid connection.",
      });
    if (!["Accepted", "Rejected"].includes(action))
      return res.status(400).json({
        message: "Invalid action type",
      });

    const response = await connectionRepo.reviewConnection(
      to,
      action,
      connectionId
    );
    return res.status(200).json({
      message: `Connection request ${action}`,
      response,
    });
  } catch (error) {
    return res.status(500).json({
      message:
        error?.errors?.status?.message ||
        error?.message ||
        "Error while sending response.",
      error: error?.errors,
    });
  }
};

module.exports = {
  sendRequest,
  reviewRequest,
};
