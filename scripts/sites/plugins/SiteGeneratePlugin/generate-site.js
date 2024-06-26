const path = require('path');
const { generateGuide } = require('./generate-guide');
const { generateComponents } = require('./generate-components');
const { generateCompositeComponents } = require('./generate-composite-comp');
const { generateResource } = require('./generate-resource');
const rootPath = path.resolve(__dirname, '../../../../');
const fs = require('fs-extra');

function generateSite({
    compPageFolder = 'sites/pc/pages/components',
    guidePageFolder = 'sites/pc/pages/guide',
    resourcePageFolder = 'sites/pc/pages/resource',
    srcFolder = 'packages/arcodesign',
    languages = ['ch', 'en'],
    tokenInfo,
    latestVersion = '0.0.0',
    compositeSrc = 'sites/composite-comp',
    compositeComp = 'sites/pc/pages/composite-comp',
    docPath = 'sites/pc/docOutput',
    compileComps = [],
    compileGuides = [],
    compileCSSSource
} = {}) {
    const srcPath = path.join(rootPath, srcFolder);
    const compSrcPath = path.join(rootPath, srcFolder, 'components');
    const compPagePath = path.join(rootPath, compPageFolder);
    const guidePagePath = path.join(rootPath, guidePageFolder);
    const resourcePagePath = path.join(rootPath, resourcePageFolder);
    const compositeCompPath = path.join(rootPath, compositeComp);
    const compositeSrcPath = path.join(rootPath, compositeSrc);
    const outputDocPath = path.join(rootPath, docPath);
    // 单组件编译
    if (compileComps.length) {
        compileComps.forEach(comp => {
            const compPath = path.join(compPagePath, comp);
            fs.removeSync(compPath);
        });
    } else {
        fs.removeSync(compPagePath);
        fs.mkdirpSync(compPagePath);
    }
    // 单README编译
    if (compileGuides.length) {
        compileGuides.forEach(guide => {
            const guidePath = path.join(guidePagePath, guide);
            fs.removeSync(guidePath);
        });
    } else {
        fs.removeSync(guidePagePath);
        fs.mkdirpSync(guidePagePath);
    }
    fs.removeSync(resourcePagePath);
    fs.mkdirpSync(resourcePagePath);

    generateGuide({
        guidePagePath,
        srcPath,
        tokenInfo,
        extraMdPath: path.resolve('sites/pc/static/md'),
        languages,
    });
    languages.forEach(language => {
        generateCompositeComponents({
            compSrcPath: compositeSrcPath,
            compPagePath: compositeCompPath,
            language,
            latestVersion,
            compileCSSSource
        });
        generateComponents({
            compSrcPath,
            compPagePath,
            language,
            latestVersion,
            compileComps,
            compileCSSSource
        });
    });
    generateResource(resourcePagePath, outputDocPath);
}

module.exports = {
    generateSite,
};
