const { settings } = require("../../models/settingsModel");

async function set(req, res) {
  const { currentTerm, currentYear } = req.body;

  try {
    await settings.create({
      currentTerm,
      currentYear,
    });

    res.json({
      message: "Publish Successful."
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong.",
    });
  }
}

async function edit(req, res) {
  const { currentTerm, currentYear } = req.body;

  const { id:settingsID } = req.params;

  try {
    await settings.findByIdAndUpdate(
      settingsID,
      {
        currentTerm,
        currentYear,
      },
      {
        new: true,
      }
    );

    res.json({
      message: "Update Successful."
    });
  } catch (error) {
    res.status(500).json({
      message: "An error occurred.",
    });
  }
}

async function fetchSetting(req, res) {
    const termYearSetting = await settings.find();

    res.send(termYearSetting);
}

module.exports = {
    set, edit, fetchSetting
};
