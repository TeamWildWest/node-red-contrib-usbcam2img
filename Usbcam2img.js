module.exports = function (RED) {
  function Usbcam2imgNode(config) {
    function HTML() {
      return require("./Usbcam2img-html.js").code(config);
    }

    RED.nodes.createNode(this, config);
    var node = this;
    node.on("input", function (msg, send) {
      msg.payload = HTML();
      send(msg);
    });
  }
  RED.nodes.registerType("usbcam2img", Usbcam2imgNode, {});
};
