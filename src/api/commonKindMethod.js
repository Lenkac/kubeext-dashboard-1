//connect vm&container's terminal
export function connectTerminal(kind,row) {
    var name = row.json.metadata.name
    console.log(kind)
    if (kind == "Pod") {
        var namespace = row.json.metadata.namespace
        window.open(
            "http://" +
            process.env.VUE_APP_CONTAINER_HOST +
            ":9000?host=" +
            process.env.VUE_APP_CONTAINER_HOST + ":8888" +
            "&podName=" +
            name +
            "&namespace=" +
            namespace
        );
    } else if (kind == "VirtualMachine") {
        window.open("http://" + process.env.VUE_APP_VNCHOST + ":6080/vnc.html?path=websockify/?token=" + name)
    }
}
