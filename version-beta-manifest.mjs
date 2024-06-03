import fs from "fs";

if (process.argv.length === 2) {
  console.error("Missing build number");
  process.exit(1);
}

const buildNumber = process.argv[2];

fs.readFile("manifest.json", "utf8", (err, data) => {
  if (err) {
    console.error(`Error reading file from disk: ${err}`);
  } else {
    const manifest = JSON.parse(data);

    manifest.version = `0.0.0-${buildNumber}`;

    fs.writeFile(
      "manifest-beta.json",
      JSON.stringify(manifest, null, 2),
      (err) => {
        if (err) console.log(err);
        else {
          console.log("File written successfully\n");
        }
      }
    );
  }
});
