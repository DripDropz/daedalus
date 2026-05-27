module.exports = function nodeGypBuildStub() {
  return {
    INIT_ERROR: true,
    LIBUSB_ERROR_NO_DEVICE: -4,
    LIBUSB_ERROR_NOT_FOUND: -5,
    getDeviceList: () => [],
    _supportedHotplugEvents: () => 0,
    _enableHotplugEvents: () => {},
    _disableHotplugEvents: () => {},
  };
};
