VOLUME_PLUGIN_DIR="/usr/libexec/kubernetes/kubelet-plugins/volume/exec"
mkdir -p "$VOLUME_PLUGIN_DIR/abcdesktop~cifs"
cd "$VOLUME_PLUGIN_DIR/abcdesktop~cifs"
curl -L -O https://docs.abcdesktop.io/config/kubernetesdriver/cifs/cifs
chmod 755 cifs
./cifs init
