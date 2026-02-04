// Modifed from: https://community.adobe.com/questions-540/jsfl-for-exporting-symbols-from-library-to-png-142742?postid=1258489#post1258489
// Usage: In the symbols panel select the symbols you want to export
//        Then run script

function exportLibraryImagesToFiles() {

    if (parseInt(fl.version.split(" ")[1].split(",")[0]) < 12) {
        alert("This command works with Flash CS6 and above.");
        return;
    }

    var doc = fl.getDocumentDOM();
    if (!doc) return;

    var selectedItems = doc.library.getSelectedItems();
    if (!selectedItems.length) return;

    var folder = fl.browseForFolderURL("Choose an output directory.");
    if (!folder) return;

    var i, t, sym, bmpName, xPath, count = 0;
    var failed = [];

    for (i = 0; i < selectedItems.length; i++) {

        sym = selectedItems[i];

        try {

            if (sym.itemType === "bitmap") {

                bmpName = sym.name.split("/").pop();

                // strip extension
                t = bmpName.lastIndexOf(".");
                if (t !== -1 && ["jpg","jpeg","png","gif","bmp","psd"].indexOf(bmpName.substr(t + 1).toLowerCase()) !== -1) {
                    bmpName = bmpName.substr(0, t);
                }

                sym.exportToFile(
                    folder + "/" + bmpName + "." + (sym.compressionType === "photo" ? "jpg" : "png")
                );

                count++;

            } else if (sym.itemType === "graphic" || sym.itemType === "movie clip") {

                doc.library.addItemToDocument({ x: 0, y: 0 }, sym.name);

                xPath = folder + "/" + sym.name.split("/").pop() + ".png";

                doc.exportInstanceToPNGSequence(xPath, 0, sym.timeline.frameCount);
                doc.deleteSelection();

                count += sym.timeline.frameCount;
            }

        } catch (e) {
            fl.trace("FAILED: " + sym.name + " → " + e);
            failed.push(sym.name);
        }
    }

    fl.trace("Export complete. " + count + " images exported.");

    if (failed.length) {
        fl.trace("----- FAILED ITEMS -----");
        for (i = 0; i < failed.length; i++) {
            fl.trace(failed[i]);
        }
        alert("Export finished with errors.\nCheck Output panel for details.");
    } else {
        alert("Export complete with no errors.");
    }
}

exportLibraryImagesToFiles();