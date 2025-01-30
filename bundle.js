import { Observable } from '@babylonjs/core/Misc/observable.js';
import { Tools } from '@babylonjs/core/Misc/tools.js';
import { registerSceneLoaderPlugin } from '@babylonjs/core/Loading/sceneLoader.js';
import { AssetContainer } from '@babylonjs/core/assetContainer.js';
import { Logger } from '@babylonjs/core/Misc/logger.js';
import { DataReader } from '@babylonjs/core/Misc/dataReader.js';
import { DecodeBase64UrlToBinary, IsBase64DataUrl, LoadFileError } from '@babylonjs/core/Misc/fileTools.js';
import { RuntimeError, ErrorCodes } from '@babylonjs/core/Misc/error.js';
import { Matrix, Vector4, Vector3, Vector2, Quaternion, TmpVectors } from '@babylonjs/core/Maths/math.vector.js';
import { Color4, Color3 } from '@babylonjs/core/Maths/math.color.js';
import { Camera } from '@babylonjs/core/Cameras/camera.js';
import { FreeCamera } from '@babylonjs/core/Cameras/freeCamera.js';
import { Animation } from '@babylonjs/core/Animations/animation.js';
import { Bone } from '@babylonjs/core/Bones/bone.js';
import { Skeleton } from '@babylonjs/core/Bones/skeleton.js';
import { Effect } from '@babylonjs/core/Materials/effect.js';
import { Material } from '@babylonjs/core/Materials/material.js';
import { MultiMaterial } from '@babylonjs/core/Materials/multiMaterial.js';
import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial.js';
import { ShaderMaterial } from '@babylonjs/core/Materials/shaderMaterial.js';
import { Texture } from '@babylonjs/core/Materials/Textures/texture.js';
import { VertexData } from '@babylonjs/core/Meshes/mesh.vertexData.js';
import { VertexBuffer, Buffer } from '@babylonjs/core/Buffers/buffer.js';
import { Geometry } from '@babylonjs/core/Meshes/geometry.js';
import { SubMesh } from '@babylonjs/core/Meshes/subMesh.js';
import { AbstractMesh } from '@babylonjs/core/Meshes/abstractMesh.js';
import { Mesh } from '@babylonjs/core/Meshes/mesh.js';
import { HemisphericLight } from '@babylonjs/core/Lights/hemisphericLight.js';
import { DirectionalLight } from '@babylonjs/core/Lights/directionalLight.js';
import { PointLight } from '@babylonjs/core/Lights/pointLight.js';
import { SpotLight } from '@babylonjs/core/Lights/spotLight.js';
import { Constants } from '@babylonjs/core/Engines/constants.js';
import { Deferred } from '@babylonjs/core/Misc/deferred.js';
import { PBRMaterial } from '@babylonjs/core/Materials/PBR/pbrMaterial.js';
import { TransformNode } from '@babylonjs/core/Meshes/transformNode.js';
import { MorphTarget } from '@babylonjs/core/Morph/morphTarget.js';
import { MorphTargetManager } from '@babylonjs/core/Morph/morphTargetManager.js';
import { BoundingInfo } from '@babylonjs/core/Culling/boundingInfo.js';
import { deepMerge } from '@babylonjs/core/Misc/deepMerger.js';
import { SphericalHarmonics, SphericalPolynomial } from '@babylonjs/core/Maths/sphericalPolynomial.js';
import { RawCubeTexture } from '@babylonjs/core/Materials/Textures/rawCubeTexture.js';
import '@babylonjs/core/Meshes/thinInstanceMesh.js';
import { MeshoptCompression } from '@babylonjs/core/Meshes/Compression/meshoptCompression.js';
import { Light } from '@babylonjs/core/Lights/light.js';
import { DracoDecoder } from '@babylonjs/core/Meshes/Compression/dracoDecoder.js';
import { RenderTargetTexture } from '@babylonjs/core/Materials/Textures/renderTargetTexture.js';
import { AnimationEvent } from '@babylonjs/core/Animations/animationEvent.js';
import { Sound } from '@babylonjs/core/Audio/sound.js';
import { WeightedSound } from '@babylonjs/core/Audio/weightedsound.js';
import '@babylonjs/core/Audio/audioSceneComponent.js';
import { FlowGraphCoordinator } from '@babylonjs/core/FlowGraph/flowGraphCoordinator.js';
import { FlowGraph } from '@babylonjs/core/FlowGraph/flowGraph.js';
import { RandomGUID } from '@babylonjs/core/Misc/guid.js';
import { FlowGraphSceneReadyEventBlock } from '@babylonjs/core/FlowGraph/Blocks/Event/flowGraphSceneReadyEventBlock.js';
import { FlowGraphSceneTickEventBlock } from '@babylonjs/core/FlowGraph/Blocks/Event/flowGraphSceneTickEventBlock.js';
import { FlowGraphConsoleLogBlock } from '@babylonjs/core/FlowGraph/Blocks/Execution/flowGraphConsoleLogBlock.js';
import { FlowGraphTimerBlock } from '@babylonjs/core/FlowGraph/Blocks/Execution/ControlFlow/flowGraphTimerBlock.js';
import { FlowGraphSendCustomEventBlock } from '@babylonjs/core/FlowGraph/Blocks/Execution/flowGraphSendCustomEventBlock.js';
import { FlowGraphReceiveCustomEventBlock } from '@babylonjs/core/FlowGraph/Blocks/Event/flowGraphReceiveCustomEventBlock.js';
import { FlowGraphSequenceBlock } from '@babylonjs/core/FlowGraph/Blocks/Execution/ControlFlow/flowGraphSequenceBlock.js';
import { FlowGraphGetPropertyBlock } from '@babylonjs/core/FlowGraph/Blocks/Data/flowGraphGetPropertyBlock.js';
import { FlowGraphSetPropertyBlock } from '@babylonjs/core/FlowGraph/Blocks/Execution/flowGraphSetPropertyBlock.js';
import { FlowGraphRandomBlock, FlowGraphEBlock, FlowGraphPiBlock, FlowGraphInfBlock, FlowGraphNaNBlock, FlowGraphAbsBlock, FlowGraphSignBlock, FlowGraphTruncBlock, FlowGraphFloorBlock, FlowGraphCeilBlock, FlowGraphFractBlock, FlowGraphNegBlock, FlowGraphAddBlock, FlowGraphSubtractBlock, FlowGraphMultiplyBlock, FlowGraphDivideBlock, FlowGraphRemainderBlock, FlowGraphMinBlock, FlowGraphMaxBlock, FlowGraphClampBlock, FlowGraphSaturateBlock, FlowGraphInterpolateBlock, FlowGraphEqBlock, FlowGraphLessThanBlock, FlowGraphLessThanOrEqualBlock, FlowGraphGreaterThanBlock, FlowGraphGreaterThanOrEqualBlock, FlowGraphIsNanBlock, FlowGraphIsInfBlock, FlowGraphDegToRadBlock, FlowGraphRadToDegBlock, FlowGraphSinBlock, FlowGraphCosBlock, FlowGraphTanBlock, FlowGraphAsinBlock, FlowGraphAcosBlock, FlowGraphAtanBlock, FlowGraphAtan2Block, FlowGraphSinhBlock, FlowGraphCoshBlock, FlowGraphTanhBlock, FlowGraphAsinhBlock, FlowGraphAcoshBlock, FlowGraphAtanhBlock, FlowGraphExpBlock, FlowGraphLogBlock, FlowGraphLog2Block, FlowGraphLog10Block, FlowGraphSqrtBlock, FlowGraphCubeRootBlock, FlowGraphPowBlock, FlowGraphLengthBlock, FlowGraphNormalizeBlock, FlowGraphDotBlock, FlowGraphCrossBlock, FlowGraphRotate2DBlock, FlowGraphRotate3DBlock, FlowGraphTransposeBlock, FlowGraphDeterminantBlock, FlowGraphInvertMatrixBlock, FlowGraphMatMulBlock, FlowGraphBitwiseNotBlock, FlowGraphBitwiseAndBlock, FlowGraphBitwiseOrBlock, FlowGraphBitwiseXorBlock, FlowGraphBitwiseRightShiftBlock, FlowGraphBitwiseLeftShiftBlock, FlowGraphCountLeadingZerosBlock, FlowGraphCountTrailingZerosBlock, FlowGraphCountOneBitsBlock } from '@babylonjs/core/FlowGraph/Blocks/Data/Math/flowGraphMathBlocks.js';
import { FlowGraphDoNBlock } from '@babylonjs/core/FlowGraph/Blocks/Execution/ControlFlow/flowGraphDoNBlock.js';
import { FlowGraphGetVariableBlock } from '@babylonjs/core/FlowGraph/Blocks/Data/flowGraphGetVariableBlock.js';
import { FlowGraphSetVariableBlock } from '@babylonjs/core/FlowGraph/Blocks/Execution/flowGraphSetVariableBlock.js';
import { FlowGraphWhileLoopBlock } from '@babylonjs/core/FlowGraph/Blocks/Execution/ControlFlow/flowGraphWhileLoopBlock.js';
import { GaussianSplattingMesh } from '@babylonjs/core/Meshes/GaussianSplatting/gaussianSplattingMesh.js';
import { PointsCloudSystem } from '@babylonjs/core/Particles/pointsCloudSystem.js';
import { Scalar } from '@babylonjs/core/Maths/math.scalar.js';

function validateAsync(data, rootUrl, fileName, getExternalResource) {
    const options = {
        externalResourceFunction: getExternalResource,
    };
    if (fileName) {
        options.uri = rootUrl === "file:" ? fileName : rootUrl + fileName;
    }
    return ArrayBuffer.isView(data) ? GLTFValidator.validateBytes(data, options) : GLTFValidator.validateString(data, options);
}
/**
 * The worker function that gets converted to a blob url to pass into a worker.
 */
function workerFunc() {
    const pendingExternalResources = [];
    onmessage = (message) => {
        const data = message.data;
        switch (data.id) {
            case "init": {
                importScripts(data.url);
                break;
            }
            case "validate": {
                validateAsync(data.data, data.rootUrl, data.fileName, (uri) => new Promise((resolve, reject) => {
                    const index = pendingExternalResources.length;
                    pendingExternalResources.push({ resolve, reject });
                    postMessage({ id: "getExternalResource", index: index, uri: uri });
                })).then((value) => {
                    postMessage({ id: "validate.resolve", value: value });
                }, (reason) => {
                    postMessage({ id: "validate.reject", reason: reason });
                });
                break;
            }
            case "getExternalResource.resolve": {
                pendingExternalResources[data.index].resolve(data.value);
                break;
            }
            case "getExternalResource.reject": {
                pendingExternalResources[data.index].reject(data.reason);
                break;
            }
        }
    };
}
/**
 * glTF validation
 */
class GLTFValidation {
    /**
     * Validate a glTF asset using the glTF-Validator.
     * @param data The JSON of a glTF or the array buffer of a binary glTF
     * @param rootUrl The root url for the glTF
     * @param fileName The file name for the glTF
     * @param getExternalResource The callback to get external resources for the glTF validator
     * @returns A promise that resolves with the glTF validation results once complete
     */
    static ValidateAsync(data, rootUrl, fileName, getExternalResource) {
        if (typeof Worker === "function") {
            return new Promise((resolve, reject) => {
                const workerContent = `${validateAsync}(${workerFunc})()`;
                const workerBlobUrl = URL.createObjectURL(new Blob([workerContent], { type: "application/javascript" }));
                const worker = new Worker(workerBlobUrl);
                const onError = (error) => {
                    worker.removeEventListener("error", onError);
                    worker.removeEventListener("message", onMessage);
                    reject(error);
                };
                const onMessage = (message) => {
                    const data = message.data;
                    switch (data.id) {
                        case "getExternalResource": {
                            getExternalResource(data.uri).then((value) => {
                                worker.postMessage({ id: "getExternalResource.resolve", index: data.index, value: value }, [value.buffer]);
                            }, (reason) => {
                                worker.postMessage({ id: "getExternalResource.reject", index: data.index, reason: reason });
                            });
                            break;
                        }
                        case "validate.resolve": {
                            worker.removeEventListener("error", onError);
                            worker.removeEventListener("message", onMessage);
                            resolve(data.value);
                            worker.terminate();
                            break;
                        }
                        case "validate.reject": {
                            worker.removeEventListener("error", onError);
                            worker.removeEventListener("message", onMessage);
                            reject(data.reason);
                            worker.terminate();
                        }
                    }
                };
                worker.addEventListener("error", onError);
                worker.addEventListener("message", onMessage);
                worker.postMessage({ id: "init", url: Tools.GetBabylonScriptURL(this.Configuration.url) });
                if (ArrayBuffer.isView(data)) {
                    // Slice the data to avoid copying the whole array buffer.
                    const slicedData = data.slice();
                    worker.postMessage({ id: "validate", data: slicedData, rootUrl: rootUrl, fileName: fileName }, [slicedData.buffer]);
                }
                else {
                    worker.postMessage({ id: "validate", data: data, rootUrl: rootUrl, fileName: fileName });
                }
            });
        }
        else {
            if (!this._LoadScriptPromise) {
                this._LoadScriptPromise = Tools.LoadBabylonScriptAsync(this.Configuration.url);
            }
            return this._LoadScriptPromise.then(() => {
                return validateAsync(data, rootUrl, fileName, getExternalResource);
            });
        }
    }
}
/**
 * The configuration. Defaults to `{ url: "https://cdn.babylonjs.com/gltf_validator.js" }`.
 */
GLTFValidation.Configuration = {
    url: `${Tools._DefaultCdnUrl}/gltf_validator.js`,
};

const GLTFMagicBase64Encoded = "Z2xURg"; // "glTF" base64 encoded (without the quotes!)
const GLTFFileLoaderMetadata = {
    name: "gltf",
    extensions: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        ".gltf": { isBinary: false, mimeType: "model/gltf+json" },
        // eslint-disable-next-line @typescript-eslint/naming-convention
        ".glb": { isBinary: true, mimeType: "model/gltf-binary" },
    },
    canDirectLoad(data) {
        return ((data.indexOf("asset") !== -1 && data.indexOf("version") !== -1) ||
            data.startsWith("data:base64," + GLTFMagicBase64Encoded) || // this is technically incorrect, but will continue to support for backcompat.
            data.startsWith("data:;base64," + GLTFMagicBase64Encoded) ||
            data.startsWith("data:application/octet-stream;base64," + GLTFMagicBase64Encoded) ||
            data.startsWith("data:model/gltf-binary;base64," + GLTFMagicBase64Encoded));
    },
};

function readAsync(arrayBuffer, byteOffset, byteLength) {
    try {
        return Promise.resolve(new Uint8Array(arrayBuffer, byteOffset, byteLength));
    }
    catch (e) {
        return Promise.reject(e);
    }
}
function readViewAsync(arrayBufferView, byteOffset, byteLength) {
    try {
        if (byteOffset < 0 || byteOffset >= arrayBufferView.byteLength) {
            throw new RangeError("Offset is out of range.");
        }
        if (byteOffset + byteLength > arrayBufferView.byteLength) {
            throw new RangeError("Length is out of range.");
        }
        return Promise.resolve(new Uint8Array(arrayBufferView.buffer, arrayBufferView.byteOffset + byteOffset, byteLength));
    }
    catch (e) {
        return Promise.reject(e);
    }
}
/**
 * Mode that determines the coordinate system to use.
 */
var GLTFLoaderCoordinateSystemMode;
(function (GLTFLoaderCoordinateSystemMode) {
    /**
     * Automatically convert the glTF right-handed data to the appropriate system based on the current coordinate system mode of the scene.
     */
    GLTFLoaderCoordinateSystemMode[GLTFLoaderCoordinateSystemMode["AUTO"] = 0] = "AUTO";
    /**
     * Sets the useRightHandedSystem flag on the scene.
     */
    GLTFLoaderCoordinateSystemMode[GLTFLoaderCoordinateSystemMode["FORCE_RIGHT_HANDED"] = 1] = "FORCE_RIGHT_HANDED";
})(GLTFLoaderCoordinateSystemMode || (GLTFLoaderCoordinateSystemMode = {}));
/**
 * Mode that determines what animations will start.
 */
var GLTFLoaderAnimationStartMode;
(function (GLTFLoaderAnimationStartMode) {
    /**
     * No animation will start.
     */
    GLTFLoaderAnimationStartMode[GLTFLoaderAnimationStartMode["NONE"] = 0] = "NONE";
    /**
     * The first animation will start.
     */
    GLTFLoaderAnimationStartMode[GLTFLoaderAnimationStartMode["FIRST"] = 1] = "FIRST";
    /**
     * All animations will start.
     */
    GLTFLoaderAnimationStartMode[GLTFLoaderAnimationStartMode["ALL"] = 2] = "ALL";
})(GLTFLoaderAnimationStartMode || (GLTFLoaderAnimationStartMode = {}));
/**
 * Loader state.
 */
var GLTFLoaderState;
(function (GLTFLoaderState) {
    /**
     * The asset is loading.
     */
    GLTFLoaderState[GLTFLoaderState["LOADING"] = 0] = "LOADING";
    /**
     * The asset is ready for rendering.
     */
    GLTFLoaderState[GLTFLoaderState["READY"] = 1] = "READY";
    /**
     * The asset is completely loaded.
     */
    GLTFLoaderState[GLTFLoaderState["COMPLETE"] = 2] = "COMPLETE";
})(GLTFLoaderState || (GLTFLoaderState = {}));
class GLTFLoaderOptions {
    constructor() {
        // ----------
        // V2 options
        // ----------
        /**
         * The coordinate system mode. Defaults to AUTO.
         */
        this.coordinateSystemMode = GLTFLoaderCoordinateSystemMode.AUTO;
        /**
         * The animation start mode. Defaults to FIRST.
         */
        this.animationStartMode = GLTFLoaderAnimationStartMode.FIRST;
        /**
         * Defines if the loader should load node animations. Defaults to true.
         * NOTE: The animation of this node will still load if the node is also a joint of a skin and `loadSkins` is true.
         */
        this.loadNodeAnimations = true;
        /**
         * Defines if the loader should load skins. Defaults to true.
         */
        this.loadSkins = true;
        /**
         * Defines if the loader should load morph targets. Defaults to true.
         */
        this.loadMorphTargets = true;
        /**
         * Defines if the loader should compile materials before raising the success callback. Defaults to false.
         */
        this.compileMaterials = false;
        /**
         * Defines if the loader should also compile materials with clip planes. Defaults to false.
         */
        this.useClipPlane = false;
        /**
         * Defines if the loader should compile shadow generators before raising the success callback. Defaults to false.
         */
        this.compileShadowGenerators = false;
        /**
         * Defines if the Alpha blended materials are only applied as coverage.
         * If false, (default) The luminance of each pixel will reduce its opacity to simulate the behaviour of most physical materials.
         * If true, no extra effects are applied to transparent pixels.
         */
        this.transparencyAsCoverage = false;
        /**
         * Defines if the loader should use range requests when load binary glTF files from HTTP.
         * Enabling will disable offline support and glTF validator.
         * Defaults to false.
         */
        this.useRangeRequests = false;
        /**
         * Defines if the loader should create instances when multiple glTF nodes point to the same glTF mesh. Defaults to true.
         */
        this.createInstances = true;
        /**
         * Defines if the loader should always compute the bounding boxes of meshes and not use the min/max values from the position accessor. Defaults to false.
         */
        this.alwaysComputeBoundingBox = false;
        /**
         * If true, load all materials defined in the file, even if not used by any mesh. Defaults to false.
         */
        this.loadAllMaterials = false;
        /**
         * If true, load only the materials defined in the file. Defaults to false.
         */
        this.loadOnlyMaterials = false;
        /**
         * If true, do not load any materials defined in the file. Defaults to false.
         */
        this.skipMaterials = false;
        /**
         * If true, load the color (gamma encoded) textures into sRGB buffers (if supported by the GPU), which will yield more accurate results when sampling the texture. Defaults to true.
         */
        this.useSRGBBuffers = true;
        /**
         * When loading glTF animations, which are defined in seconds, target them to this FPS. Defaults to 60.
         */
        this.targetFps = 60;
        /**
         * Defines if the loader should always compute the nearest common ancestor of the skeleton joints instead of using `skin.skeleton`. Defaults to false.
         * Set this to true if loading assets with invalid `skin.skeleton` values.
         */
        this.alwaysComputeSkeletonRootNode = false;
        /**
         * If true, the loader will derive the name for Babylon textures from the glTF texture name, image name, or image url. Defaults to false.
         * Note that it is possible for multiple Babylon textures to share the same name when the Babylon textures load from the same glTF texture or image.
         */
        this.useGltfTextureNames = false;
        /**
         * Function called before loading a url referenced by the asset.
         * @param url url referenced by the asset
         * @returns Async url to load
         */
        this.preprocessUrlAsync = (url) => Promise.resolve(url);
        /**
         * Defines options for glTF extensions.
         */
        this.extensionOptions = {};
    }
    // eslint-disable-next-line babylonjs/available
    copyFrom(options) {
        if (options) {
            this.onParsed = options.onParsed;
            this.coordinateSystemMode = options.coordinateSystemMode ?? this.coordinateSystemMode;
            this.animationStartMode = options.animationStartMode ?? this.animationStartMode;
            this.loadNodeAnimations = options.loadNodeAnimations ?? this.loadNodeAnimations;
            this.loadSkins = options.loadSkins ?? this.loadSkins;
            this.loadMorphTargets = options.loadMorphTargets ?? this.loadMorphTargets;
            this.compileMaterials = options.compileMaterials ?? this.compileMaterials;
            this.useClipPlane = options.useClipPlane ?? this.useClipPlane;
            this.compileShadowGenerators = options.compileShadowGenerators ?? this.compileShadowGenerators;
            this.transparencyAsCoverage = options.transparencyAsCoverage ?? this.transparencyAsCoverage;
            this.useRangeRequests = options.useRangeRequests ?? this.useRangeRequests;
            this.createInstances = options.createInstances ?? this.createInstances;
            this.alwaysComputeBoundingBox = options.alwaysComputeBoundingBox ?? this.alwaysComputeBoundingBox;
            this.loadAllMaterials = options.loadAllMaterials ?? this.loadAllMaterials;
            this.loadOnlyMaterials = options.loadOnlyMaterials ?? this.loadOnlyMaterials;
            this.skipMaterials = options.skipMaterials ?? this.skipMaterials;
            this.useSRGBBuffers = options.useSRGBBuffers ?? this.useSRGBBuffers;
            this.targetFps = options.targetFps ?? this.targetFps;
            this.alwaysComputeSkeletonRootNode = options.alwaysComputeSkeletonRootNode ?? this.alwaysComputeSkeletonRootNode;
            this.useGltfTextureNames = options.useGltfTextureNames ?? this.useGltfTextureNames;
            this.preprocessUrlAsync = options.preprocessUrlAsync ?? this.preprocessUrlAsync;
            this.customRootNode = options.customRootNode;
            this.onMeshLoaded = options.onMeshLoaded;
            this.onSkinLoaded = options.onSkinLoaded;
            this.onTextureLoaded = options.onTextureLoaded;
            this.onMaterialLoaded = options.onMaterialLoaded;
            this.onCameraLoaded = options.onCameraLoaded;
            this.extensionOptions = options.extensionOptions ?? this.extensionOptions;
        }
    }
}
/**
 * File loader for loading glTF files into a scene.
 */
class GLTFFileLoader extends GLTFLoaderOptions {
    /**
     * Creates a new glTF file loader.
     * @param options The options for the loader
     */
    constructor(options) {
        super();
        // --------------------
        // Begin Common options
        // --------------------
        /**
         * Raised when the asset has been parsed
         */
        this.onParsedObservable = new Observable();
        // --------------
        // End V1 options
        // --------------
        /**
         * Observable raised when the loader creates a mesh after parsing the glTF properties of the mesh.
         * Note that the observable is raised as soon as the mesh object is created, meaning some data may not have been setup yet for this mesh (vertex data, morph targets, material, ...)
         */
        this.onMeshLoadedObservable = new Observable();
        /**
         * Observable raised when the loader creates a skin after parsing the glTF properties of the skin node.
         * @see https://doc.babylonjs.com/features/featuresDeepDive/importers/glTF/glTFSkinning#ignoring-the-transform-of-the-skinned-mesh
         * @param node - the transform node that corresponds to the original glTF skin node used for animations
         * @param skinnedNode - the transform node that is the skinned mesh itself or the parent of the skinned meshes
         */
        this.onSkinLoadedObservable = new Observable();
        /**
         * Observable raised when the loader creates a texture after parsing the glTF properties of the texture.
         */
        this.onTextureLoadedObservable = new Observable();
        /**
         * Observable raised when the loader creates a material after parsing the glTF properties of the material.
         */
        this.onMaterialLoadedObservable = new Observable();
        /**
         * Observable raised when the loader creates a camera after parsing the glTF properties of the camera.
         */
        this.onCameraLoadedObservable = new Observable();
        /**
         * Observable raised when the asset is completely loaded, immediately before the loader is disposed.
         * For assets with LODs, raised when all of the LODs are complete.
         * For assets without LODs, raised when the model is complete, immediately after the loader resolves the returned promise.
         */
        this.onCompleteObservable = new Observable();
        /**
         * Observable raised when an error occurs.
         */
        this.onErrorObservable = new Observable();
        /**
         * Observable raised after the loader is disposed.
         */
        this.onDisposeObservable = new Observable();
        /**
         * Observable raised after a loader extension is created.
         * Set additional options for a loader extension in this event.
         */
        this.onExtensionLoadedObservable = new Observable();
        /**
         * Defines if the loader should validate the asset.
         */
        this.validate = false;
        /**
         * Observable raised after validation when validate is set to true. The event data is the result of the validation.
         */
        this.onValidatedObservable = new Observable();
        this._loader = null;
        this._state = null;
        this._requests = new Array();
        /**
         * Name of the loader ("gltf")
         */
        this.name = GLTFFileLoaderMetadata.name;
        /** @internal */
        this.extensions = GLTFFileLoaderMetadata.extensions;
        /**
         * Observable raised when the loader state changes.
         */
        this.onLoaderStateChangedObservable = new Observable();
        this._logIndentLevel = 0;
        this._loggingEnabled = false;
        /** @internal */
        this._log = this._logDisabled;
        this._capturePerformanceCounters = false;
        /** @internal */
        this._startPerformanceCounter = this._startPerformanceCounterDisabled;
        /** @internal */
        this._endPerformanceCounter = this._endPerformanceCounterDisabled;
        this.copyFrom(options);
    }
    /**
     * Raised when the asset has been parsed
     */
    set onParsed(callback) {
        if (this._onParsedObserver) {
            this.onParsedObservable.remove(this._onParsedObserver);
        }
        if (callback) {
            this._onParsedObserver = this.onParsedObservable.add(callback);
        }
    }
    /**
     * Callback raised when the loader creates a mesh after parsing the glTF properties of the mesh.
     * Note that the callback is called as soon as the mesh object is created, meaning some data may not have been setup yet for this mesh (vertex data, morph targets, material, ...)
     */
    set onMeshLoaded(callback) {
        if (this._onMeshLoadedObserver) {
            this.onMeshLoadedObservable.remove(this._onMeshLoadedObserver);
        }
        if (callback) {
            this._onMeshLoadedObserver = this.onMeshLoadedObservable.add(callback);
        }
    }
    /**
     * Callback raised when the loader creates a skin after parsing the glTF properties of the skin node.
     * @see https://doc.babylonjs.com/features/featuresDeepDive/importers/glTF/glTFSkinning#ignoring-the-transform-of-the-skinned-mesh
     */
    set onSkinLoaded(callback) {
        if (this._onSkinLoadedObserver) {
            this.onSkinLoadedObservable.remove(this._onSkinLoadedObserver);
        }
        if (callback) {
            this._onSkinLoadedObserver = this.onSkinLoadedObservable.add((data) => callback(data.node, data.skinnedNode));
        }
    }
    /**
     * Callback raised when the loader creates a texture after parsing the glTF properties of the texture.
     */
    set onTextureLoaded(callback) {
        if (this._onTextureLoadedObserver) {
            this.onTextureLoadedObservable.remove(this._onTextureLoadedObserver);
        }
        if (callback) {
            this._onTextureLoadedObserver = this.onTextureLoadedObservable.add(callback);
        }
    }
    /**
     * Callback raised when the loader creates a material after parsing the glTF properties of the material.
     */
    set onMaterialLoaded(callback) {
        if (this._onMaterialLoadedObserver) {
            this.onMaterialLoadedObservable.remove(this._onMaterialLoadedObserver);
        }
        if (callback) {
            this._onMaterialLoadedObserver = this.onMaterialLoadedObservable.add(callback);
        }
    }
    /**
     * Callback raised when the loader creates a camera after parsing the glTF properties of the camera.
     */
    set onCameraLoaded(callback) {
        if (this._onCameraLoadedObserver) {
            this.onCameraLoadedObservable.remove(this._onCameraLoadedObserver);
        }
        if (callback) {
            this._onCameraLoadedObserver = this.onCameraLoadedObservable.add(callback);
        }
    }
    /**
     * Callback raised when the asset is completely loaded, immediately before the loader is disposed.
     * For assets with LODs, raised when all of the LODs are complete.
     * For assets without LODs, raised when the model is complete, immediately after the loader resolves the returned promise.
     */
    set onComplete(callback) {
        if (this._onCompleteObserver) {
            this.onCompleteObservable.remove(this._onCompleteObserver);
        }
        this._onCompleteObserver = this.onCompleteObservable.add(callback);
    }
    /**
     * Callback raised when an error occurs.
     */
    set onError(callback) {
        if (this._onErrorObserver) {
            this.onErrorObservable.remove(this._onErrorObserver);
        }
        this._onErrorObserver = this.onErrorObservable.add(callback);
    }
    /**
     * Callback raised after the loader is disposed.
     */
    set onDispose(callback) {
        if (this._onDisposeObserver) {
            this.onDisposeObservable.remove(this._onDisposeObserver);
        }
        this._onDisposeObserver = this.onDisposeObservable.add(callback);
    }
    /**
     * Callback raised after a loader extension is created.
     */
    set onExtensionLoaded(callback) {
        if (this._onExtensionLoadedObserver) {
            this.onExtensionLoadedObservable.remove(this._onExtensionLoadedObserver);
        }
        this._onExtensionLoadedObserver = this.onExtensionLoadedObservable.add(callback);
    }
    /**
     * Defines if the loader logging is enabled.
     */
    get loggingEnabled() {
        return this._loggingEnabled;
    }
    set loggingEnabled(value) {
        if (this._loggingEnabled === value) {
            return;
        }
        this._loggingEnabled = value;
        if (this._loggingEnabled) {
            this._log = this._logEnabled;
        }
        else {
            this._log = this._logDisabled;
        }
    }
    /**
     * Defines if the loader should capture performance counters.
     */
    get capturePerformanceCounters() {
        return this._capturePerformanceCounters;
    }
    set capturePerformanceCounters(value) {
        if (this._capturePerformanceCounters === value) {
            return;
        }
        this._capturePerformanceCounters = value;
        if (this._capturePerformanceCounters) {
            this._startPerformanceCounter = this._startPerformanceCounterEnabled;
            this._endPerformanceCounter = this._endPerformanceCounterEnabled;
        }
        else {
            this._startPerformanceCounter = this._startPerformanceCounterDisabled;
            this._endPerformanceCounter = this._endPerformanceCounterDisabled;
        }
    }
    /**
     * Callback raised after a loader extension is created.
     */
    set onValidated(callback) {
        if (this._onValidatedObserver) {
            this.onValidatedObservable.remove(this._onValidatedObserver);
        }
        this._onValidatedObserver = this.onValidatedObservable.add(callback);
    }
    /**
     * Disposes the loader, releases resources during load, and cancels any outstanding requests.
     */
    dispose() {
        if (this._loader) {
            this._loader.dispose();
            this._loader = null;
        }
        for (const request of this._requests) {
            request.abort();
        }
        this._requests.length = 0;
        delete this._progressCallback;
        this.preprocessUrlAsync = (url) => Promise.resolve(url);
        this.onMeshLoadedObservable.clear();
        this.onSkinLoadedObservable.clear();
        this.onTextureLoadedObservable.clear();
        this.onMaterialLoadedObservable.clear();
        this.onCameraLoadedObservable.clear();
        this.onCompleteObservable.clear();
        this.onExtensionLoadedObservable.clear();
        this.onDisposeObservable.notifyObservers(undefined);
        this.onDisposeObservable.clear();
    }
    /**
     * @internal
     */
    loadFile(scene, fileOrUrl, rootUrl, onSuccess, onProgress, useArrayBuffer, onError, name) {
        if (ArrayBuffer.isView(fileOrUrl)) {
            this._loadBinary(scene, fileOrUrl, rootUrl, onSuccess, onError, name);
            return null;
        }
        this._progressCallback = onProgress;
        const fileName = fileOrUrl.name || Tools.GetFilename(fileOrUrl);
        if (useArrayBuffer) {
            if (this.useRangeRequests) {
                if (this.validate) {
                    Logger.Warn("glTF validation is not supported when range requests are enabled");
                }
                const fileRequest = {
                    abort: () => { },
                    onCompleteObservable: new Observable(),
                };
                const dataBuffer = {
                    readAsync: (byteOffset, byteLength) => {
                        return new Promise((resolve, reject) => {
                            this._loadFile(scene, fileOrUrl, (data) => {
                                resolve(new Uint8Array(data));
                            }, true, (error) => {
                                reject(error);
                            }, (webRequest) => {
                                webRequest.setRequestHeader("Range", `bytes=${byteOffset}-${byteOffset + byteLength - 1}`);
                            });
                        });
                    },
                    byteLength: 0,
                };
                this._unpackBinaryAsync(new DataReader(dataBuffer)).then((loaderData) => {
                    fileRequest.onCompleteObservable.notifyObservers(fileRequest);
                    onSuccess(loaderData);
                }, onError ? (error) => onError(undefined, error) : undefined);
                return fileRequest;
            }
            return this._loadFile(scene, fileOrUrl, (data) => {
                this._validate(scene, new Uint8Array(data, 0, data.byteLength), rootUrl, fileName);
                this._unpackBinaryAsync(new DataReader({
                    readAsync: (byteOffset, byteLength) => readAsync(data, byteOffset, byteLength),
                    byteLength: data.byteLength,
                })).then((loaderData) => {
                    onSuccess(loaderData);
                }, onError ? (error) => onError(undefined, error) : undefined);
            }, true, onError);
        }
        else {
            return this._loadFile(scene, fileOrUrl, (data) => {
                try {
                    this._validate(scene, data, rootUrl, fileName);
                    onSuccess({ json: this._parseJson(data) });
                }
                catch {
                    if (onError) {
                        onError();
                    }
                }
            }, false, onError);
        }
    }
    _loadBinary(scene, data, rootUrl, onSuccess, onError, fileName) {
        this._validate(scene, new Uint8Array(data.buffer, data.byteOffset, data.byteLength), rootUrl, fileName);
        this._unpackBinaryAsync(new DataReader({
            readAsync: (byteOffset, byteLength) => readViewAsync(data, byteOffset, byteLength),
            byteLength: data.byteLength,
        })).then((loaderData) => {
            onSuccess(loaderData);
        }, onError ? (error) => onError(undefined, error) : undefined);
    }
    /**
     * @internal
     */
    importMeshAsync(meshesNames, scene, data, rootUrl, onProgress, fileName) {
        return Promise.resolve().then(() => {
            this.onParsedObservable.notifyObservers(data);
            this.onParsedObservable.clear();
            this._log(`Loading ${fileName || ""}`);
            this._loader = this._getLoader(data);
            return this._loader.importMeshAsync(meshesNames, scene, null, data, rootUrl, onProgress, fileName);
        });
    }
    /**
     * @internal
     */
    loadAsync(scene, data, rootUrl, onProgress, fileName) {
        return Promise.resolve().then(() => {
            this.onParsedObservable.notifyObservers(data);
            this.onParsedObservable.clear();
            this._log(`Loading ${fileName || ""}`);
            this._loader = this._getLoader(data);
            return this._loader.loadAsync(scene, data, rootUrl, onProgress, fileName);
        });
    }
    /**
     * @internal
     */
    loadAssetContainerAsync(scene, data, rootUrl, onProgress, fileName) {
        return Promise.resolve().then(() => {
            this.onParsedObservable.notifyObservers(data);
            this.onParsedObservable.clear();
            this._log(`Loading ${fileName || ""}`);
            this._loader = this._getLoader(data);
            // Prepare the asset container.
            const container = new AssetContainer(scene);
            // Get materials/textures when loading to add to container
            const materials = [];
            this.onMaterialLoadedObservable.add((material) => {
                materials.push(material);
            });
            const textures = [];
            this.onTextureLoadedObservable.add((texture) => {
                textures.push(texture);
            });
            const cameras = [];
            this.onCameraLoadedObservable.add((camera) => {
                cameras.push(camera);
            });
            const morphTargetManagers = [];
            this.onMeshLoadedObservable.add((mesh) => {
                if (mesh.morphTargetManager) {
                    morphTargetManagers.push(mesh.morphTargetManager);
                }
            });
            return this._loader.importMeshAsync(null, scene, container, data, rootUrl, onProgress, fileName).then((result) => {
                Array.prototype.push.apply(container.geometries, result.geometries);
                Array.prototype.push.apply(container.meshes, result.meshes);
                Array.prototype.push.apply(container.particleSystems, result.particleSystems);
                Array.prototype.push.apply(container.skeletons, result.skeletons);
                Array.prototype.push.apply(container.animationGroups, result.animationGroups);
                Array.prototype.push.apply(container.materials, materials);
                Array.prototype.push.apply(container.textures, textures);
                Array.prototype.push.apply(container.lights, result.lights);
                Array.prototype.push.apply(container.transformNodes, result.transformNodes);
                Array.prototype.push.apply(container.cameras, cameras);
                Array.prototype.push.apply(container.morphTargetManagers, morphTargetManagers);
                return container;
            });
        });
    }
    /**
     * @internal
     */
    canDirectLoad(data) {
        return GLTFFileLoaderMetadata.canDirectLoad(data);
    }
    /**
     * @internal
     */
    directLoad(scene, data) {
        if (data.startsWith("base64," + GLTFMagicBase64Encoded) || // this is technically incorrect, but will continue to support for backcompat.
            data.startsWith(";base64," + GLTFMagicBase64Encoded) ||
            data.startsWith("application/octet-stream;base64," + GLTFMagicBase64Encoded) ||
            data.startsWith("model/gltf-binary;base64," + GLTFMagicBase64Encoded)) {
            const arrayBuffer = DecodeBase64UrlToBinary(data);
            this._validate(scene, new Uint8Array(arrayBuffer, 0, arrayBuffer.byteLength));
            return this._unpackBinaryAsync(new DataReader({
                readAsync: (byteOffset, byteLength) => readAsync(arrayBuffer, byteOffset, byteLength),
                byteLength: arrayBuffer.byteLength,
            }));
        }
        this._validate(scene, data);
        return Promise.resolve({ json: this._parseJson(data) });
    }
    /** @internal */
    createPlugin(options) {
        return new GLTFFileLoader(options[GLTFFileLoaderMetadata.name]);
    }
    /**
     * The loader state or null if the loader is not active.
     */
    get loaderState() {
        return this._state;
    }
    /**
     * Returns a promise that resolves when the asset is completely loaded.
     * @returns a promise that resolves when the asset is completely loaded.
     */
    whenCompleteAsync() {
        return new Promise((resolve, reject) => {
            this.onCompleteObservable.addOnce(() => {
                resolve();
            });
            this.onErrorObservable.addOnce((reason) => {
                reject(reason);
            });
        });
    }
    /**
     * @internal
     */
    _setState(state) {
        if (this._state === state) {
            return;
        }
        this._state = state;
        this.onLoaderStateChangedObservable.notifyObservers(this._state);
        this._log(GLTFLoaderState[this._state]);
    }
    /**
     * @internal
     */
    _loadFile(scene, fileOrUrl, onSuccess, useArrayBuffer, onError, onOpened) {
        const request = scene._loadFile(fileOrUrl, onSuccess, (event) => {
            this._onProgress(event, request);
        }, true, useArrayBuffer, onError, onOpened);
        request.onCompleteObservable.add(() => {
            // Force the length computable to be true since we can guarantee the data is loaded.
            request._lengthComputable = true;
            request._total = request._loaded;
        });
        this._requests.push(request);
        return request;
    }
    _onProgress(event, request) {
        if (!this._progressCallback) {
            return;
        }
        request._lengthComputable = event.lengthComputable;
        request._loaded = event.loaded;
        request._total = event.total;
        let lengthComputable = true;
        let loaded = 0;
        let total = 0;
        for (const request of this._requests) {
            if (request._lengthComputable === undefined || request._loaded === undefined || request._total === undefined) {
                return;
            }
            lengthComputable = lengthComputable && request._lengthComputable;
            loaded += request._loaded;
            total += request._total;
        }
        this._progressCallback({
            lengthComputable: lengthComputable,
            loaded: loaded,
            total: lengthComputable ? total : 0,
        });
    }
    _validate(scene, data, rootUrl = "", fileName = "") {
        if (!this.validate) {
            return;
        }
        this._startPerformanceCounter("Validate JSON");
        GLTFValidation.ValidateAsync(data, rootUrl, fileName, (uri) => {
            return this.preprocessUrlAsync(rootUrl + uri).then((url) => {
                return scene._loadFileAsync(url, undefined, true, true).then((data) => {
                    return new Uint8Array(data, 0, data.byteLength);
                });
            });
        }).then((result) => {
            this._endPerformanceCounter("Validate JSON");
            this.onValidatedObservable.notifyObservers(result);
            this.onValidatedObservable.clear();
        }, (reason) => {
            this._endPerformanceCounter("Validate JSON");
            Tools.Warn(`Failed to validate: ${reason.message}`);
            this.onValidatedObservable.clear();
        });
    }
    _getLoader(loaderData) {
        const asset = loaderData.json.asset || {};
        this._log(`Asset version: ${asset.version}`);
        asset.minVersion && this._log(`Asset minimum version: ${asset.minVersion}`);
        asset.generator && this._log(`Asset generator: ${asset.generator}`);
        const version = GLTFFileLoader._parseVersion(asset.version);
        if (!version) {
            throw new Error("Invalid version: " + asset.version);
        }
        if (asset.minVersion !== undefined) {
            const minVersion = GLTFFileLoader._parseVersion(asset.minVersion);
            if (!minVersion) {
                throw new Error("Invalid minimum version: " + asset.minVersion);
            }
            if (GLTFFileLoader._compareVersion(minVersion, { major: 2, minor: 0 }) > 0) {
                throw new Error("Incompatible minimum version: " + asset.minVersion);
            }
        }
        const createLoaders = {
            1: GLTFFileLoader._CreateGLTF1Loader,
            2: GLTFFileLoader._CreateGLTF2Loader,
        };
        const createLoader = createLoaders[version.major];
        if (!createLoader) {
            throw new Error("Unsupported version: " + asset.version);
        }
        return createLoader(this);
    }
    _parseJson(json) {
        this._startPerformanceCounter("Parse JSON");
        this._log(`JSON length: ${json.length}`);
        const parsed = JSON.parse(json);
        this._endPerformanceCounter("Parse JSON");
        return parsed;
    }
    _unpackBinaryAsync(dataReader) {
        this._startPerformanceCounter("Unpack Binary");
        // Read magic + version + length + json length + json format
        return dataReader.loadAsync(20).then(() => {
            const Binary = {
                Magic: 0x46546c67,
            };
            const magic = dataReader.readUint32();
            if (magic !== Binary.Magic) {
                throw new RuntimeError("Unexpected magic: " + magic, ErrorCodes.GLTFLoaderUnexpectedMagicError);
            }
            const version = dataReader.readUint32();
            if (this.loggingEnabled) {
                this._log(`Binary version: ${version}`);
            }
            const length = dataReader.readUint32();
            if (!this.useRangeRequests && length !== dataReader.buffer.byteLength) {
                Logger.Warn(`Length in header does not match actual data length: ${length} != ${dataReader.buffer.byteLength}`);
            }
            let unpacked;
            switch (version) {
                case 1: {
                    unpacked = this._unpackBinaryV1Async(dataReader, length);
                    break;
                }
                case 2: {
                    unpacked = this._unpackBinaryV2Async(dataReader, length);
                    break;
                }
                default: {
                    throw new Error("Unsupported version: " + version);
                }
            }
            this._endPerformanceCounter("Unpack Binary");
            return unpacked;
        });
    }
    _unpackBinaryV1Async(dataReader, length) {
        const ContentFormat = {
            JSON: 0,
        };
        const contentLength = dataReader.readUint32();
        const contentFormat = dataReader.readUint32();
        if (contentFormat !== ContentFormat.JSON) {
            throw new Error(`Unexpected content format: ${contentFormat}`);
        }
        const bodyLength = length - dataReader.byteOffset;
        const data = { json: this._parseJson(dataReader.readString(contentLength)), bin: null };
        if (bodyLength !== 0) {
            const startByteOffset = dataReader.byteOffset;
            data.bin = {
                readAsync: (byteOffset, byteLength) => dataReader.buffer.readAsync(startByteOffset + byteOffset, byteLength),
                byteLength: bodyLength,
            };
        }
        return Promise.resolve(data);
    }
    _unpackBinaryV2Async(dataReader, length) {
        const ChunkFormat = {
            JSON: 0x4e4f534a,
            BIN: 0x004e4942,
        };
        // Read the JSON chunk header.
        const chunkLength = dataReader.readUint32();
        const chunkFormat = dataReader.readUint32();
        if (chunkFormat !== ChunkFormat.JSON) {
            throw new Error("First chunk format is not JSON");
        }
        // Bail if there are no other chunks.
        if (dataReader.byteOffset + chunkLength === length) {
            return dataReader.loadAsync(chunkLength).then(() => {
                return { json: this._parseJson(dataReader.readString(chunkLength)), bin: null };
            });
        }
        // Read the JSON chunk and the length and type of the next chunk.
        return dataReader.loadAsync(chunkLength + 8).then(() => {
            const data = { json: this._parseJson(dataReader.readString(chunkLength)), bin: null };
            const readAsync = () => {
                const chunkLength = dataReader.readUint32();
                const chunkFormat = dataReader.readUint32();
                switch (chunkFormat) {
                    case ChunkFormat.JSON: {
                        throw new Error("Unexpected JSON chunk");
                    }
                    case ChunkFormat.BIN: {
                        const startByteOffset = dataReader.byteOffset;
                        data.bin = {
                            readAsync: (byteOffset, byteLength) => dataReader.buffer.readAsync(startByteOffset + byteOffset, byteLength),
                            byteLength: chunkLength,
                        };
                        dataReader.skipBytes(chunkLength);
                        break;
                    }
                    default: {
                        // ignore unrecognized chunkFormat
                        dataReader.skipBytes(chunkLength);
                        break;
                    }
                }
                if (dataReader.byteOffset !== length) {
                    return dataReader.loadAsync(8).then(readAsync);
                }
                return Promise.resolve(data);
            };
            return readAsync();
        });
    }
    static _parseVersion(version) {
        if (version === "1.0" || version === "1.0.1") {
            return {
                major: 1,
                minor: 0,
            };
        }
        const match = (version + "").match(/^(\d+)\.(\d+)/);
        if (!match) {
            return null;
        }
        return {
            major: parseInt(match[1]),
            minor: parseInt(match[2]),
        };
    }
    static _compareVersion(a, b) {
        if (a.major > b.major) {
            return 1;
        }
        if (a.major < b.major) {
            return -1;
        }
        if (a.minor > b.minor) {
            return 1;
        }
        if (a.minor < b.minor) {
            return -1;
        }
        return 0;
    }
    /**
     * @internal
     */
    _logOpen(message) {
        this._log(message);
        this._logIndentLevel++;
    }
    /** @internal */
    _logClose() {
        --this._logIndentLevel;
    }
    _logEnabled(message) {
        const spaces = GLTFFileLoader._logSpaces.substring(0, this._logIndentLevel * 2);
        Logger.Log(`${spaces}${message}`);
    }
    _logDisabled(message) { }
    _startPerformanceCounterEnabled(counterName) {
        Tools.StartPerformanceCounter(counterName);
    }
    _startPerformanceCounterDisabled(counterName) { }
    _endPerformanceCounterEnabled(counterName) {
        Tools.EndPerformanceCounter(counterName);
    }
    _endPerformanceCounterDisabled(counterName) { }
}
// ------------------
// End Common options
// ------------------
// ----------------
// Begin V1 options
// ----------------
/**
 * Set this property to false to disable incremental loading which delays the loader from calling the success callback until after loading the meshes and shaders.
 * Textures always loads asynchronously. For example, the success callback can compute the bounding information of the loaded meshes when incremental loading is disabled.
 * Defaults to true.
 * @internal
 */
GLTFFileLoader.IncrementalLoading = true;
/**
 * Set this property to true in order to work with homogeneous coordinates, available with some converters and exporters.
 * Defaults to false. See https://en.wikipedia.org/wiki/Homogeneous_coordinates.
 * @internal
 */
GLTFFileLoader.HomogeneousCoordinates = false;
GLTFFileLoader._logSpaces = "                                ";
registerSceneLoaderPlugin(new GLTFFileLoader());

/**
 * Enums
 * @internal
 */
var EComponentType;
(function (EComponentType) {
    EComponentType[EComponentType["BYTE"] = 5120] = "BYTE";
    EComponentType[EComponentType["UNSIGNED_BYTE"] = 5121] = "UNSIGNED_BYTE";
    EComponentType[EComponentType["SHORT"] = 5122] = "SHORT";
    EComponentType[EComponentType["UNSIGNED_SHORT"] = 5123] = "UNSIGNED_SHORT";
    EComponentType[EComponentType["FLOAT"] = 5126] = "FLOAT";
})(EComponentType || (EComponentType = {}));
/** @internal */
var EShaderType;
(function (EShaderType) {
    EShaderType[EShaderType["FRAGMENT"] = 35632] = "FRAGMENT";
    EShaderType[EShaderType["VERTEX"] = 35633] = "VERTEX";
})(EShaderType || (EShaderType = {}));
/** @internal */
var EParameterType;
(function (EParameterType) {
    EParameterType[EParameterType["BYTE"] = 5120] = "BYTE";
    EParameterType[EParameterType["UNSIGNED_BYTE"] = 5121] = "UNSIGNED_BYTE";
    EParameterType[EParameterType["SHORT"] = 5122] = "SHORT";
    EParameterType[EParameterType["UNSIGNED_SHORT"] = 5123] = "UNSIGNED_SHORT";
    EParameterType[EParameterType["INT"] = 5124] = "INT";
    EParameterType[EParameterType["UNSIGNED_INT"] = 5125] = "UNSIGNED_INT";
    EParameterType[EParameterType["FLOAT"] = 5126] = "FLOAT";
    EParameterType[EParameterType["FLOAT_VEC2"] = 35664] = "FLOAT_VEC2";
    EParameterType[EParameterType["FLOAT_VEC3"] = 35665] = "FLOAT_VEC3";
    EParameterType[EParameterType["FLOAT_VEC4"] = 35666] = "FLOAT_VEC4";
    EParameterType[EParameterType["INT_VEC2"] = 35667] = "INT_VEC2";
    EParameterType[EParameterType["INT_VEC3"] = 35668] = "INT_VEC3";
    EParameterType[EParameterType["INT_VEC4"] = 35669] = "INT_VEC4";
    EParameterType[EParameterType["BOOL"] = 35670] = "BOOL";
    EParameterType[EParameterType["BOOL_VEC2"] = 35671] = "BOOL_VEC2";
    EParameterType[EParameterType["BOOL_VEC3"] = 35672] = "BOOL_VEC3";
    EParameterType[EParameterType["BOOL_VEC4"] = 35673] = "BOOL_VEC4";
    EParameterType[EParameterType["FLOAT_MAT2"] = 35674] = "FLOAT_MAT2";
    EParameterType[EParameterType["FLOAT_MAT3"] = 35675] = "FLOAT_MAT3";
    EParameterType[EParameterType["FLOAT_MAT4"] = 35676] = "FLOAT_MAT4";
    EParameterType[EParameterType["SAMPLER_2D"] = 35678] = "SAMPLER_2D";
})(EParameterType || (EParameterType = {}));
/** @internal */
var ETextureWrapMode;
(function (ETextureWrapMode) {
    ETextureWrapMode[ETextureWrapMode["CLAMP_TO_EDGE"] = 33071] = "CLAMP_TO_EDGE";
    ETextureWrapMode[ETextureWrapMode["MIRRORED_REPEAT"] = 33648] = "MIRRORED_REPEAT";
    ETextureWrapMode[ETextureWrapMode["REPEAT"] = 10497] = "REPEAT";
})(ETextureWrapMode || (ETextureWrapMode = {}));
/** @internal */
var ETextureFilterType;
(function (ETextureFilterType) {
    ETextureFilterType[ETextureFilterType["NEAREST"] = 9728] = "NEAREST";
    ETextureFilterType[ETextureFilterType["LINEAR"] = 9728] = "LINEAR";
    ETextureFilterType[ETextureFilterType["NEAREST_MIPMAP_NEAREST"] = 9984] = "NEAREST_MIPMAP_NEAREST";
    ETextureFilterType[ETextureFilterType["LINEAR_MIPMAP_NEAREST"] = 9985] = "LINEAR_MIPMAP_NEAREST";
    ETextureFilterType[ETextureFilterType["NEAREST_MIPMAP_LINEAR"] = 9986] = "NEAREST_MIPMAP_LINEAR";
    ETextureFilterType[ETextureFilterType["LINEAR_MIPMAP_LINEAR"] = 9987] = "LINEAR_MIPMAP_LINEAR";
})(ETextureFilterType || (ETextureFilterType = {}));
/** @internal */
var ETextureFormat;
(function (ETextureFormat) {
    ETextureFormat[ETextureFormat["ALPHA"] = 6406] = "ALPHA";
    ETextureFormat[ETextureFormat["RGB"] = 6407] = "RGB";
    ETextureFormat[ETextureFormat["RGBA"] = 6408] = "RGBA";
    ETextureFormat[ETextureFormat["LUMINANCE"] = 6409] = "LUMINANCE";
    ETextureFormat[ETextureFormat["LUMINANCE_ALPHA"] = 6410] = "LUMINANCE_ALPHA";
})(ETextureFormat || (ETextureFormat = {}));
/** @internal */
var ECullingType;
(function (ECullingType) {
    ECullingType[ECullingType["FRONT"] = 1028] = "FRONT";
    ECullingType[ECullingType["BACK"] = 1029] = "BACK";
    ECullingType[ECullingType["FRONT_AND_BACK"] = 1032] = "FRONT_AND_BACK";
})(ECullingType || (ECullingType = {}));
/** @internal */
var EBlendingFunction;
(function (EBlendingFunction) {
    EBlendingFunction[EBlendingFunction["ZERO"] = 0] = "ZERO";
    EBlendingFunction[EBlendingFunction["ONE"] = 1] = "ONE";
    EBlendingFunction[EBlendingFunction["SRC_COLOR"] = 768] = "SRC_COLOR";
    EBlendingFunction[EBlendingFunction["ONE_MINUS_SRC_COLOR"] = 769] = "ONE_MINUS_SRC_COLOR";
    EBlendingFunction[EBlendingFunction["DST_COLOR"] = 774] = "DST_COLOR";
    EBlendingFunction[EBlendingFunction["ONE_MINUS_DST_COLOR"] = 775] = "ONE_MINUS_DST_COLOR";
    EBlendingFunction[EBlendingFunction["SRC_ALPHA"] = 770] = "SRC_ALPHA";
    EBlendingFunction[EBlendingFunction["ONE_MINUS_SRC_ALPHA"] = 771] = "ONE_MINUS_SRC_ALPHA";
    EBlendingFunction[EBlendingFunction["DST_ALPHA"] = 772] = "DST_ALPHA";
    EBlendingFunction[EBlendingFunction["ONE_MINUS_DST_ALPHA"] = 773] = "ONE_MINUS_DST_ALPHA";
    EBlendingFunction[EBlendingFunction["CONSTANT_COLOR"] = 32769] = "CONSTANT_COLOR";
    EBlendingFunction[EBlendingFunction["ONE_MINUS_CONSTANT_COLOR"] = 32770] = "ONE_MINUS_CONSTANT_COLOR";
    EBlendingFunction[EBlendingFunction["CONSTANT_ALPHA"] = 32771] = "CONSTANT_ALPHA";
    EBlendingFunction[EBlendingFunction["ONE_MINUS_CONSTANT_ALPHA"] = 32772] = "ONE_MINUS_CONSTANT_ALPHA";
    EBlendingFunction[EBlendingFunction["SRC_ALPHA_SATURATE"] = 776] = "SRC_ALPHA_SATURATE";
})(EBlendingFunction || (EBlendingFunction = {}));

/**
 * Utils functions for GLTF
 * @internal
 * @deprecated
 */
class GLTFUtils {
    /**
     * Sets the given "parameter" matrix
     * @param scene the Scene object
     * @param source the source node where to pick the matrix
     * @param parameter the GLTF technique parameter
     * @param uniformName the name of the shader's uniform
     * @param shaderMaterial the shader material
     */
    static SetMatrix(scene, source, parameter, uniformName, shaderMaterial) {
        let mat = null;
        if (parameter.semantic === "MODEL") {
            mat = source.getWorldMatrix();
        }
        else if (parameter.semantic === "PROJECTION") {
            mat = scene.getProjectionMatrix();
        }
        else if (parameter.semantic === "VIEW") {
            mat = scene.getViewMatrix();
        }
        else if (parameter.semantic === "MODELVIEWINVERSETRANSPOSE") {
            mat = Matrix.Transpose(source.getWorldMatrix().multiply(scene.getViewMatrix()).invert());
        }
        else if (parameter.semantic === "MODELVIEW") {
            mat = source.getWorldMatrix().multiply(scene.getViewMatrix());
        }
        else if (parameter.semantic === "MODELVIEWPROJECTION") {
            mat = source.getWorldMatrix().multiply(scene.getTransformMatrix());
        }
        else if (parameter.semantic === "MODELINVERSE") {
            mat = source.getWorldMatrix().invert();
        }
        else if (parameter.semantic === "VIEWINVERSE") {
            mat = scene.getViewMatrix().invert();
        }
        else if (parameter.semantic === "PROJECTIONINVERSE") {
            mat = scene.getProjectionMatrix().invert();
        }
        else if (parameter.semantic === "MODELVIEWINVERSE") {
            mat = source.getWorldMatrix().multiply(scene.getViewMatrix()).invert();
        }
        else if (parameter.semantic === "MODELVIEWPROJECTIONINVERSE") {
            mat = source.getWorldMatrix().multiply(scene.getTransformMatrix()).invert();
        }
        else if (parameter.semantic === "MODELINVERSETRANSPOSE") {
            mat = Matrix.Transpose(source.getWorldMatrix().invert());
        }
        if (mat) {
            switch (parameter.type) {
                case EParameterType.FLOAT_MAT2:
                    shaderMaterial.setMatrix2x2(uniformName, Matrix.GetAsMatrix2x2(mat));
                    break;
                case EParameterType.FLOAT_MAT3:
                    shaderMaterial.setMatrix3x3(uniformName, Matrix.GetAsMatrix3x3(mat));
                    break;
                case EParameterType.FLOAT_MAT4:
                    shaderMaterial.setMatrix(uniformName, mat);
                    break;
            }
        }
    }
    /**
     * Sets the given "parameter" matrix
     * @param shaderMaterial the shader material
     * @param uniform the name of the shader's uniform
     * @param value the value of the uniform
     * @param type the uniform's type (EParameterType FLOAT, VEC2, VEC3 or VEC4)
     * @returns true if set, else false
     */
    static SetUniform(shaderMaterial, uniform, value, type) {
        switch (type) {
            case EParameterType.FLOAT:
                shaderMaterial.setFloat(uniform, value);
                return true;
            case EParameterType.FLOAT_VEC2:
                shaderMaterial.setVector2(uniform, Vector2.FromArray(value));
                return true;
            case EParameterType.FLOAT_VEC3:
                shaderMaterial.setVector3(uniform, Vector3.FromArray(value));
                return true;
            case EParameterType.FLOAT_VEC4:
                shaderMaterial.setVector4(uniform, Vector4.FromArray(value));
                return true;
            default:
                return false;
        }
    }
    /**
     * Returns the wrap mode of the texture
     * @param mode the mode value
     * @returns the wrap mode (TEXTURE_WRAP_ADDRESSMODE, MIRROR_ADDRESSMODE or CLAMP_ADDRESSMODE)
     */
    static GetWrapMode(mode) {
        switch (mode) {
            case ETextureWrapMode.CLAMP_TO_EDGE:
                return Texture.CLAMP_ADDRESSMODE;
            case ETextureWrapMode.MIRRORED_REPEAT:
                return Texture.MIRROR_ADDRESSMODE;
            case ETextureWrapMode.REPEAT:
                return Texture.WRAP_ADDRESSMODE;
            default:
                return Texture.WRAP_ADDRESSMODE;
        }
    }
    /**
     * Returns the byte stride giving an accessor
     * @param accessor the GLTF accessor objet
     * @returns the byte stride
     */
    static GetByteStrideFromType(accessor) {
        // Needs this function since "byteStride" isn't requiered in glTF format
        const type = accessor.type;
        switch (type) {
            case "VEC2":
                return 2;
            case "VEC3":
                return 3;
            case "VEC4":
                return 4;
            case "MAT2":
                return 4;
            case "MAT3":
                return 9;
            case "MAT4":
                return 16;
            default:
                return 1;
        }
    }
    /**
     * Returns the texture filter mode giving a mode value
     * @param mode the filter mode value
     * @returns the filter mode (TODO - needs to be a type?)
     */
    static GetTextureFilterMode(mode) {
        switch (mode) {
            case ETextureFilterType.LINEAR:
            case ETextureFilterType.LINEAR_MIPMAP_NEAREST:
            case ETextureFilterType.LINEAR_MIPMAP_LINEAR:
                return Texture.TRILINEAR_SAMPLINGMODE;
            case ETextureFilterType.NEAREST:
            case ETextureFilterType.NEAREST_MIPMAP_NEAREST:
                return Texture.NEAREST_SAMPLINGMODE;
            default:
                return Texture.BILINEAR_SAMPLINGMODE;
        }
    }
    static GetBufferFromBufferView(gltfRuntime, bufferView, byteOffset, byteLength, componentType) {
        byteOffset = bufferView.byteOffset + byteOffset;
        const loadedBufferView = gltfRuntime.loadedBufferViews[bufferView.buffer];
        if (byteOffset + byteLength > loadedBufferView.byteLength) {
            throw new Error("Buffer access is out of range");
        }
        const buffer = loadedBufferView.buffer;
        byteOffset += loadedBufferView.byteOffset;
        switch (componentType) {
            case EComponentType.BYTE:
                return new Int8Array(buffer, byteOffset, byteLength);
            case EComponentType.UNSIGNED_BYTE:
                return new Uint8Array(buffer, byteOffset, byteLength);
            case EComponentType.SHORT:
                return new Int16Array(buffer, byteOffset, byteLength);
            case EComponentType.UNSIGNED_SHORT:
                return new Uint16Array(buffer, byteOffset, byteLength);
            default:
                return new Float32Array(buffer, byteOffset, byteLength);
        }
    }
    /**
     * Returns a buffer from its accessor
     * @param gltfRuntime the GLTF runtime
     * @param accessor the GLTF accessor
     * @returns an array buffer view
     */
    static GetBufferFromAccessor(gltfRuntime, accessor) {
        const bufferView = gltfRuntime.bufferViews[accessor.bufferView];
        const byteLength = accessor.count * GLTFUtils.GetByteStrideFromType(accessor);
        return GLTFUtils.GetBufferFromBufferView(gltfRuntime, bufferView, accessor.byteOffset, byteLength, accessor.componentType);
    }
    /**
     * Decodes a buffer view into a string
     * @param view the buffer view
     * @returns a string
     */
    static DecodeBufferToText(view) {
        let result = "";
        const length = view.byteLength;
        for (let i = 0; i < length; ++i) {
            result += String.fromCharCode(view[i]);
        }
        return result;
    }
    /**
     * Returns the default material of gltf. Related to
     * https://github.com/KhronosGroup/glTF/tree/master/specification/1.0#appendix-a-default-material
     * @param scene the Babylon.js scene
     * @returns the default Babylon material
     */
    static GetDefaultMaterial(scene) {
        if (!GLTFUtils._DefaultMaterial) {
            Effect.ShadersStore["GLTFDefaultMaterialVertexShader"] = [
                "precision highp float;",
                "",
                "uniform mat4 worldView;",
                "uniform mat4 projection;",
                "",
                "attribute vec3 position;",
                "",
                "void main(void)",
                "{",
                "    gl_Position = projection * worldView * vec4(position, 1.0);",
                "}",
            ].join("\n");
            Effect.ShadersStore["GLTFDefaultMaterialPixelShader"] = [
                "precision highp float;",
                "",
                "uniform vec4 u_emission;",
                "",
                "void main(void)",
                "{",
                "    gl_FragColor = u_emission;",
                "}",
            ].join("\n");
            const shaderPath = {
                vertex: "GLTFDefaultMaterial",
                fragment: "GLTFDefaultMaterial",
            };
            const options = {
                attributes: ["position"],
                uniforms: ["worldView", "projection", "u_emission"],
                samplers: new Array(),
                needAlphaBlending: false,
            };
            GLTFUtils._DefaultMaterial = new ShaderMaterial("GLTFDefaultMaterial", scene, shaderPath, options);
            GLTFUtils._DefaultMaterial.setColor4("u_emission", new Color4(0.5, 0.5, 0.5, 1.0));
        }
        return GLTFUtils._DefaultMaterial;
    }
}
// The GLTF default material
GLTFUtils._DefaultMaterial = null;

/**
 * Tokenizer. Used for shaders compatibility
 * Automatically map world, view, projection, worldViewProjection, attributes and so on
 */
var ETokenType;
(function (ETokenType) {
    ETokenType[ETokenType["IDENTIFIER"] = 1] = "IDENTIFIER";
    ETokenType[ETokenType["UNKNOWN"] = 2] = "UNKNOWN";
    ETokenType[ETokenType["END_OF_INPUT"] = 3] = "END_OF_INPUT";
})(ETokenType || (ETokenType = {}));
class Tokenizer {
    constructor(toParse) {
        this._pos = 0;
        this.currentToken = ETokenType.UNKNOWN;
        this.currentIdentifier = "";
        this.currentString = "";
        this.isLetterOrDigitPattern = /^[a-zA-Z0-9]+$/;
        this._toParse = toParse;
        this._maxPos = toParse.length;
    }
    getNextToken() {
        if (this.isEnd()) {
            return ETokenType.END_OF_INPUT;
        }
        this.currentString = this.read();
        this.currentToken = ETokenType.UNKNOWN;
        if (this.currentString === "_" || this.isLetterOrDigitPattern.test(this.currentString)) {
            this.currentToken = ETokenType.IDENTIFIER;
            this.currentIdentifier = this.currentString;
            while (!this.isEnd() && (this.isLetterOrDigitPattern.test((this.currentString = this.peek())) || this.currentString === "_")) {
                this.currentIdentifier += this.currentString;
                this.forward();
            }
        }
        return this.currentToken;
    }
    peek() {
        return this._toParse[this._pos];
    }
    read() {
        return this._toParse[this._pos++];
    }
    forward() {
        this._pos++;
    }
    isEnd() {
        return this._pos >= this._maxPos;
    }
}
/**
 * Values
 */
const glTFTransforms = ["MODEL", "VIEW", "PROJECTION", "MODELVIEW", "MODELVIEWPROJECTION", "JOINTMATRIX"];
const babylonTransforms = ["world", "view", "projection", "worldView", "worldViewProjection", "mBones"];
const glTFAnimationPaths = ["translation", "rotation", "scale"];
const babylonAnimationPaths = ["position", "rotationQuaternion", "scaling"];
/**
 * Parse
 * @param parsedBuffers
 * @param gltfRuntime
 */
const parseBuffers = (parsedBuffers, gltfRuntime) => {
    for (const buf in parsedBuffers) {
        const parsedBuffer = parsedBuffers[buf];
        gltfRuntime.buffers[buf] = parsedBuffer;
        gltfRuntime.buffersCount++;
    }
};
const parseShaders = (parsedShaders, gltfRuntime) => {
    for (const sha in parsedShaders) {
        const parsedShader = parsedShaders[sha];
        gltfRuntime.shaders[sha] = parsedShader;
        gltfRuntime.shaderscount++;
    }
};
const parseObject = (parsedObjects, runtimeProperty, gltfRuntime) => {
    for (const object in parsedObjects) {
        const parsedObject = parsedObjects[object];
        gltfRuntime[runtimeProperty][object] = parsedObject;
    }
};
/**
 * Utils
 * @param buffer
 */
const normalizeUVs = (buffer) => {
    if (!buffer) {
        return;
    }
    for (let i = 0; i < buffer.length / 2; i++) {
        buffer[i * 2 + 1] = 1.0 - buffer[i * 2 + 1];
    }
};
const getAttribute = (attributeParameter) => {
    if (attributeParameter.semantic === "NORMAL") {
        return "normal";
    }
    else if (attributeParameter.semantic === "POSITION") {
        return "position";
    }
    else if (attributeParameter.semantic === "JOINT") {
        return "matricesIndices";
    }
    else if (attributeParameter.semantic === "WEIGHT") {
        return "matricesWeights";
    }
    else if (attributeParameter.semantic === "COLOR") {
        return "color";
    }
    else if (attributeParameter.semantic && attributeParameter.semantic.indexOf("TEXCOORD_") !== -1) {
        const channel = Number(attributeParameter.semantic.split("_")[1]);
        return "uv" + (channel === 0 ? "" : channel + 1);
    }
    return null;
};
/**
 * Loads and creates animations
 * @param gltfRuntime
 */
const loadAnimations = (gltfRuntime) => {
    for (const anim in gltfRuntime.animations) {
        const animation = gltfRuntime.animations[anim];
        if (!animation.channels || !animation.samplers) {
            continue;
        }
        let lastAnimation = null;
        for (let i = 0; i < animation.channels.length; i++) {
            // Get parameters and load buffers
            const channel = animation.channels[i];
            const sampler = animation.samplers[channel.sampler];
            if (!sampler) {
                continue;
            }
            let inputData = null;
            let outputData = null;
            if (animation.parameters) {
                inputData = animation.parameters[sampler.input];
                outputData = animation.parameters[sampler.output];
            }
            else {
                inputData = sampler.input;
                outputData = sampler.output;
            }
            const bufferInput = GLTFUtils.GetBufferFromAccessor(gltfRuntime, gltfRuntime.accessors[inputData]);
            const bufferOutput = GLTFUtils.GetBufferFromAccessor(gltfRuntime, gltfRuntime.accessors[outputData]);
            const targetId = channel.target.id;
            let targetNode = gltfRuntime.scene.getNodeById(targetId);
            if (targetNode === null) {
                targetNode = gltfRuntime.scene.getNodeByName(targetId);
            }
            if (targetNode === null) {
                Tools.Warn("Creating animation named " + anim + ". But cannot find node named " + targetId + " to attach to");
                continue;
            }
            const isBone = targetNode instanceof Bone;
            // Get target path (position, rotation or scaling)
            let targetPath = channel.target.path;
            const targetPathIndex = glTFAnimationPaths.indexOf(targetPath);
            if (targetPathIndex !== -1) {
                targetPath = babylonAnimationPaths[targetPathIndex];
            }
            // Determine animation type
            let animationType = Animation.ANIMATIONTYPE_MATRIX;
            if (!isBone) {
                if (targetPath === "rotationQuaternion") {
                    animationType = Animation.ANIMATIONTYPE_QUATERNION;
                    targetNode.rotationQuaternion = new Quaternion();
                }
                else {
                    animationType = Animation.ANIMATIONTYPE_VECTOR3;
                }
            }
            // Create animation and key frames
            let babylonAnimation = null;
            const keys = [];
            let arrayOffset = 0;
            let modifyKey = false;
            if (isBone && lastAnimation && lastAnimation.getKeys().length === bufferInput.length) {
                babylonAnimation = lastAnimation;
                modifyKey = true;
            }
            if (!modifyKey) {
                gltfRuntime.scene._blockEntityCollection = !!gltfRuntime.assetContainer;
                babylonAnimation = new Animation(anim, isBone ? "_matrix" : targetPath, 1, animationType, Animation.ANIMATIONLOOPMODE_CYCLE);
                gltfRuntime.scene._blockEntityCollection = false;
            }
            // For each frame
            for (let j = 0; j < bufferInput.length; j++) {
                let value = null;
                if (targetPath === "rotationQuaternion") {
                    // VEC4
                    value = Quaternion.FromArray([bufferOutput[arrayOffset], bufferOutput[arrayOffset + 1], bufferOutput[arrayOffset + 2], bufferOutput[arrayOffset + 3]]);
                    arrayOffset += 4;
                }
                else {
                    // Position and scaling are VEC3
                    value = Vector3.FromArray([bufferOutput[arrayOffset], bufferOutput[arrayOffset + 1], bufferOutput[arrayOffset + 2]]);
                    arrayOffset += 3;
                }
                if (isBone) {
                    const bone = targetNode;
                    let translation = Vector3.Zero();
                    let rotationQuaternion = new Quaternion();
                    let scaling = Vector3.Zero();
                    // Warning on decompose
                    let mat = bone.getBaseMatrix();
                    if (modifyKey && lastAnimation) {
                        mat = lastAnimation.getKeys()[j].value;
                    }
                    mat.decompose(scaling, rotationQuaternion, translation);
                    if (targetPath === "position") {
                        translation = value;
                    }
                    else if (targetPath === "rotationQuaternion") {
                        rotationQuaternion = value;
                    }
                    else {
                        scaling = value;
                    }
                    value = Matrix.Compose(scaling, rotationQuaternion, translation);
                }
                if (!modifyKey) {
                    keys.push({
                        frame: bufferInput[j],
                        value: value,
                    });
                }
                else if (lastAnimation) {
                    lastAnimation.getKeys()[j].value = value;
                }
            }
            // Finish
            if (!modifyKey && babylonAnimation) {
                babylonAnimation.setKeys(keys);
                targetNode.animations.push(babylonAnimation);
            }
            lastAnimation = babylonAnimation;
            gltfRuntime.scene.stopAnimation(targetNode);
            gltfRuntime.scene.beginAnimation(targetNode, 0, bufferInput[bufferInput.length - 1], true, 1.0);
        }
    }
};
/**
 * @returns the bones transformation matrix
 * @param node
 */
const configureBoneTransformation = (node) => {
    let mat = null;
    if (node.translation || node.rotation || node.scale) {
        const scale = Vector3.FromArray(node.scale || [1, 1, 1]);
        const rotation = Quaternion.FromArray(node.rotation || [0, 0, 0, 1]);
        const position = Vector3.FromArray(node.translation || [0, 0, 0]);
        mat = Matrix.Compose(scale, rotation, position);
    }
    else {
        mat = Matrix.FromArray(node.matrix);
    }
    return mat;
};
/**
 * Returns the parent bone
 * @param gltfRuntime
 * @param skins
 * @param jointName
 * @param newSkeleton
 * @returns the parent bone
 */
const getParentBone = (gltfRuntime, skins, jointName, newSkeleton) => {
    // Try to find
    for (let i = 0; i < newSkeleton.bones.length; i++) {
        if (newSkeleton.bones[i].name === jointName) {
            return newSkeleton.bones[i];
        }
    }
    // Not found, search in gltf nodes
    const nodes = gltfRuntime.nodes;
    for (const nde in nodes) {
        const node = nodes[nde];
        if (!node.jointName) {
            continue;
        }
        const children = node.children;
        for (let i = 0; i < children.length; i++) {
            const child = gltfRuntime.nodes[children[i]];
            if (!child.jointName) {
                continue;
            }
            if (child.jointName === jointName) {
                const mat = configureBoneTransformation(node);
                const bone = new Bone(node.name || "", newSkeleton, getParentBone(gltfRuntime, skins, node.jointName, newSkeleton), mat);
                bone.id = nde;
                return bone;
            }
        }
    }
    return null;
};
/**
 * Returns the appropriate root node
 * @param nodesToRoot
 * @param id
 * @returns the root node
 */
const getNodeToRoot = (nodesToRoot, id) => {
    for (let i = 0; i < nodesToRoot.length; i++) {
        const nodeToRoot = nodesToRoot[i];
        for (let j = 0; j < nodeToRoot.node.children.length; j++) {
            const child = nodeToRoot.node.children[j];
            if (child === id) {
                return nodeToRoot.bone;
            }
        }
    }
    return null;
};
/**
 * Returns the node with the joint name
 * @param gltfRuntime
 * @param jointName
 * @returns the node with the joint name
 */
const getJointNode = (gltfRuntime, jointName) => {
    const nodes = gltfRuntime.nodes;
    let node = nodes[jointName];
    if (node) {
        return {
            node: node,
            id: jointName,
        };
    }
    for (const nde in nodes) {
        node = nodes[nde];
        if (node.jointName === jointName) {
            return {
                node: node,
                id: nde,
            };
        }
    }
    return null;
};
/**
 * Checks if a nodes is in joints
 * @param skins
 * @param id
 * @returns true if the node is in joints, else false
 */
const nodeIsInJoints = (skins, id) => {
    for (let i = 0; i < skins.jointNames.length; i++) {
        if (skins.jointNames[i] === id) {
            return true;
        }
    }
    return false;
};
/**
 * Fills the nodes to root for bones and builds hierarchy
 * @param gltfRuntime
 * @param newSkeleton
 * @param skins
 * @param nodesToRoot
 */
const getNodesToRoot = (gltfRuntime, newSkeleton, skins, nodesToRoot) => {
    // Creates nodes for root
    for (const nde in gltfRuntime.nodes) {
        const node = gltfRuntime.nodes[nde];
        const id = nde;
        if (!node.jointName || nodeIsInJoints(skins, node.jointName)) {
            continue;
        }
        // Create node to root bone
        const mat = configureBoneTransformation(node);
        const bone = new Bone(node.name || "", newSkeleton, null, mat);
        bone.id = id;
        nodesToRoot.push({ bone: bone, node: node, id: id });
    }
    // Parenting
    for (let i = 0; i < nodesToRoot.length; i++) {
        const nodeToRoot = nodesToRoot[i];
        const children = nodeToRoot.node.children;
        for (let j = 0; j < children.length; j++) {
            let child = null;
            for (let k = 0; k < nodesToRoot.length; k++) {
                if (nodesToRoot[k].id === children[j]) {
                    child = nodesToRoot[k];
                    break;
                }
            }
            if (child) {
                child.bone._parent = nodeToRoot.bone;
                nodeToRoot.bone.children.push(child.bone);
            }
        }
    }
};
/**
 * Imports a skeleton
 * @param gltfRuntime
 * @param skins
 * @param mesh
 * @param newSkeleton
 * @returns the bone name
 */
const importSkeleton = (gltfRuntime, skins, mesh, newSkeleton) => {
    if (!newSkeleton) {
        newSkeleton = new Skeleton(skins.name || "", "", gltfRuntime.scene);
    }
    if (!skins.babylonSkeleton) {
        return newSkeleton;
    }
    // Find the root bones
    const nodesToRoot = [];
    const nodesToRootToAdd = [];
    getNodesToRoot(gltfRuntime, newSkeleton, skins, nodesToRoot);
    newSkeleton.bones = [];
    // Joints
    for (let i = 0; i < skins.jointNames.length; i++) {
        const jointNode = getJointNode(gltfRuntime, skins.jointNames[i]);
        if (!jointNode) {
            continue;
        }
        const node = jointNode.node;
        if (!node) {
            Tools.Warn("Joint named " + skins.jointNames[i] + " does not exist");
            continue;
        }
        const id = jointNode.id;
        // Optimize, if the bone already exists...
        const existingBone = gltfRuntime.scene.getBoneById(id);
        if (existingBone) {
            newSkeleton.bones.push(existingBone);
            continue;
        }
        // Search for parent bone
        let foundBone = false;
        let parentBone = null;
        for (let j = 0; j < i; j++) {
            const jointNode = getJointNode(gltfRuntime, skins.jointNames[j]);
            if (!jointNode) {
                continue;
            }
            const joint = jointNode.node;
            if (!joint) {
                Tools.Warn("Joint named " + skins.jointNames[j] + " does not exist when looking for parent");
                continue;
            }
            const children = joint.children;
            if (!children) {
                continue;
            }
            foundBone = false;
            for (let k = 0; k < children.length; k++) {
                if (children[k] === id) {
                    parentBone = getParentBone(gltfRuntime, skins, skins.jointNames[j], newSkeleton);
                    foundBone = true;
                    break;
                }
            }
            if (foundBone) {
                break;
            }
        }
        // Create bone
        const mat = configureBoneTransformation(node);
        if (!parentBone && nodesToRoot.length > 0) {
            parentBone = getNodeToRoot(nodesToRoot, id);
            if (parentBone) {
                if (nodesToRootToAdd.indexOf(parentBone) === -1) {
                    nodesToRootToAdd.push(parentBone);
                }
            }
        }
        const bone = new Bone(node.jointName || "", newSkeleton, parentBone, mat);
        bone.id = id;
    }
    // Polish
    const bones = newSkeleton.bones;
    newSkeleton.bones = [];
    for (let i = 0; i < skins.jointNames.length; i++) {
        const jointNode = getJointNode(gltfRuntime, skins.jointNames[i]);
        if (!jointNode) {
            continue;
        }
        for (let j = 0; j < bones.length; j++) {
            if (bones[j].id === jointNode.id) {
                newSkeleton.bones.push(bones[j]);
                break;
            }
        }
    }
    newSkeleton.prepare();
    // Finish
    for (let i = 0; i < nodesToRootToAdd.length; i++) {
        newSkeleton.bones.push(nodesToRootToAdd[i]);
    }
    return newSkeleton;
};
/**
 * Imports a mesh and its geometries
 * @param gltfRuntime
 * @param node
 * @param meshes
 * @param id
 * @param newMesh
 * @returns the new mesh
 */
const importMesh = (gltfRuntime, node, meshes, id, newMesh) => {
    if (!newMesh) {
        gltfRuntime.scene._blockEntityCollection = !!gltfRuntime.assetContainer;
        newMesh = new Mesh(node.name || "", gltfRuntime.scene);
        newMesh._parentContainer = gltfRuntime.assetContainer;
        gltfRuntime.scene._blockEntityCollection = false;
        newMesh.id = id;
    }
    if (!node.babylonNode) {
        return newMesh;
    }
    const subMaterials = [];
    let vertexData = null;
    const verticesStarts = [];
    const verticesCounts = [];
    const indexStarts = [];
    const indexCounts = [];
    for (let meshIndex = 0; meshIndex < meshes.length; meshIndex++) {
        const meshId = meshes[meshIndex];
        const mesh = gltfRuntime.meshes[meshId];
        if (!mesh) {
            continue;
        }
        // Positions, normals and UVs
        for (let i = 0; i < mesh.primitives.length; i++) {
            // Temporary vertex data
            const tempVertexData = new VertexData();
            const primitive = mesh.primitives[i];
            if (primitive.mode !== 4) ;
            const attributes = primitive.attributes;
            let accessor = null;
            let buffer = null;
            // Set positions, normal and uvs
            for (const semantic in attributes) {
                // Link accessor and buffer view
                accessor = gltfRuntime.accessors[attributes[semantic]];
                buffer = GLTFUtils.GetBufferFromAccessor(gltfRuntime, accessor);
                if (semantic === "NORMAL") {
                    tempVertexData.normals = new Float32Array(buffer.length);
                    tempVertexData.normals.set(buffer);
                }
                else if (semantic === "POSITION") {
                    if (GLTFFileLoader.HomogeneousCoordinates) {
                        tempVertexData.positions = new Float32Array(buffer.length - buffer.length / 4);
                        for (let j = 0; j < buffer.length; j += 4) {
                            tempVertexData.positions[j] = buffer[j];
                            tempVertexData.positions[j + 1] = buffer[j + 1];
                            tempVertexData.positions[j + 2] = buffer[j + 2];
                        }
                    }
                    else {
                        tempVertexData.positions = new Float32Array(buffer.length);
                        tempVertexData.positions.set(buffer);
                    }
                    verticesCounts.push(tempVertexData.positions.length);
                }
                else if (semantic.indexOf("TEXCOORD_") !== -1) {
                    const channel = Number(semantic.split("_")[1]);
                    const uvKind = VertexBuffer.UVKind + (channel === 0 ? "" : channel + 1);
                    const uvs = new Float32Array(buffer.length);
                    uvs.set(buffer);
                    normalizeUVs(uvs);
                    tempVertexData.set(uvs, uvKind);
                }
                else if (semantic === "JOINT") {
                    tempVertexData.matricesIndices = new Float32Array(buffer.length);
                    tempVertexData.matricesIndices.set(buffer);
                }
                else if (semantic === "WEIGHT") {
                    tempVertexData.matricesWeights = new Float32Array(buffer.length);
                    tempVertexData.matricesWeights.set(buffer);
                }
                else if (semantic === "COLOR") {
                    tempVertexData.colors = new Float32Array(buffer.length);
                    tempVertexData.colors.set(buffer);
                }
            }
            // Indices
            accessor = gltfRuntime.accessors[primitive.indices];
            if (accessor) {
                buffer = GLTFUtils.GetBufferFromAccessor(gltfRuntime, accessor);
                tempVertexData.indices = new Int32Array(buffer.length);
                tempVertexData.indices.set(buffer);
                indexCounts.push(tempVertexData.indices.length);
            }
            else {
                // Set indices on the fly
                const indices = [];
                for (let j = 0; j < tempVertexData.positions.length / 3; j++) {
                    indices.push(j);
                }
                tempVertexData.indices = new Int32Array(indices);
                indexCounts.push(tempVertexData.indices.length);
            }
            if (!vertexData) {
                vertexData = tempVertexData;
            }
            else {
                vertexData.merge(tempVertexData);
            }
            // Sub material
            const material = gltfRuntime.scene.getMaterialById(primitive.material);
            subMaterials.push(material === null ? GLTFUtils.GetDefaultMaterial(gltfRuntime.scene) : material);
            // Update vertices start and index start
            verticesStarts.push(verticesStarts.length === 0 ? 0 : verticesStarts[verticesStarts.length - 1] + verticesCounts[verticesCounts.length - 2]);
            indexStarts.push(indexStarts.length === 0 ? 0 : indexStarts[indexStarts.length - 1] + indexCounts[indexCounts.length - 2]);
        }
    }
    let material;
    gltfRuntime.scene._blockEntityCollection = !!gltfRuntime.assetContainer;
    if (subMaterials.length > 1) {
        material = new MultiMaterial("multimat" + id, gltfRuntime.scene);
        material.subMaterials = subMaterials;
    }
    else {
        material = new StandardMaterial("multimat" + id, gltfRuntime.scene);
    }
    if (subMaterials.length === 1) {
        material = subMaterials[0];
    }
    material._parentContainer = gltfRuntime.assetContainer;
    if (!newMesh.material) {
        newMesh.material = material;
    }
    // Apply geometry
    new Geometry(id, gltfRuntime.scene, vertexData, false, newMesh);
    newMesh.computeWorldMatrix(true);
    gltfRuntime.scene._blockEntityCollection = false;
    // Apply submeshes
    newMesh.subMeshes = [];
    let index = 0;
    for (let meshIndex = 0; meshIndex < meshes.length; meshIndex++) {
        const meshId = meshes[meshIndex];
        const mesh = gltfRuntime.meshes[meshId];
        if (!mesh) {
            continue;
        }
        for (let i = 0; i < mesh.primitives.length; i++) {
            if (mesh.primitives[i].mode !== 4) ;
            SubMesh.AddToMesh(index, verticesStarts[index], verticesCounts[index], indexStarts[index], indexCounts[index], newMesh, newMesh, true);
            index++;
        }
    }
    // Finish
    return newMesh;
};
/**
 * Configure node transformation from position, rotation and scaling
 * @param newNode
 * @param position
 * @param rotation
 * @param scaling
 */
const configureNode = (newNode, position, rotation, scaling) => {
    if (newNode.position) {
        newNode.position = position;
    }
    if (newNode.rotationQuaternion || newNode.rotation) {
        newNode.rotationQuaternion = rotation;
    }
    if (newNode.scaling) {
        newNode.scaling = scaling;
    }
};
/**
 * Configures node from transformation matrix
 * @param newNode
 * @param node
 */
const configureNodeFromMatrix = (newNode, node) => {
    if (node.matrix) {
        const position = new Vector3(0, 0, 0);
        const rotation = new Quaternion();
        const scaling = new Vector3(0, 0, 0);
        const mat = Matrix.FromArray(node.matrix);
        mat.decompose(scaling, rotation, position);
        configureNode(newNode, position, rotation, scaling);
    }
    else if (node.translation && node.rotation && node.scale) {
        configureNode(newNode, Vector3.FromArray(node.translation), Quaternion.FromArray(node.rotation), Vector3.FromArray(node.scale));
    }
    newNode.computeWorldMatrix(true);
};
/**
 * Imports a node
 * @param gltfRuntime
 * @param node
 * @param id
 * @returns the newly imported node
 */
const importNode = (gltfRuntime, node, id) => {
    let lastNode = null;
    if (gltfRuntime.importOnlyMeshes && (node.skin || node.meshes)) {
        if (gltfRuntime.importMeshesNames && gltfRuntime.importMeshesNames.length > 0 && gltfRuntime.importMeshesNames.indexOf(node.name || "") === -1) {
            return null;
        }
    }
    // Meshes
    if (node.skin) {
        if (node.meshes) {
            const skin = gltfRuntime.skins[node.skin];
            const newMesh = importMesh(gltfRuntime, node, node.meshes, id, node.babylonNode);
            newMesh.skeleton = gltfRuntime.scene.getLastSkeletonById(node.skin);
            if (newMesh.skeleton === null) {
                newMesh.skeleton = importSkeleton(gltfRuntime, skin, newMesh, skin.babylonSkeleton);
                if (!skin.babylonSkeleton) {
                    skin.babylonSkeleton = newMesh.skeleton;
                }
            }
            lastNode = newMesh;
        }
    }
    else if (node.meshes) {
        /**
         * Improve meshes property
         */
        const newMesh = importMesh(gltfRuntime, node, node.mesh ? [node.mesh] : node.meshes, id, node.babylonNode);
        lastNode = newMesh;
    }
    // Lights
    else if (node.light && !node.babylonNode && !gltfRuntime.importOnlyMeshes) {
        const light = gltfRuntime.lights[node.light];
        if (light) {
            if (light.type === "ambient") {
                const ambienLight = light[light.type];
                const hemiLight = new HemisphericLight(node.light, Vector3.Zero(), gltfRuntime.scene);
                hemiLight.name = node.name || "";
                if (ambienLight.color) {
                    hemiLight.diffuse = Color3.FromArray(ambienLight.color);
                }
                lastNode = hemiLight;
            }
            else if (light.type === "directional") {
                const directionalLight = light[light.type];
                const dirLight = new DirectionalLight(node.light, Vector3.Zero(), gltfRuntime.scene);
                dirLight.name = node.name || "";
                if (directionalLight.color) {
                    dirLight.diffuse = Color3.FromArray(directionalLight.color);
                }
                lastNode = dirLight;
            }
            else if (light.type === "point") {
                const pointLight = light[light.type];
                const ptLight = new PointLight(node.light, Vector3.Zero(), gltfRuntime.scene);
                ptLight.name = node.name || "";
                if (pointLight.color) {
                    ptLight.diffuse = Color3.FromArray(pointLight.color);
                }
                lastNode = ptLight;
            }
            else if (light.type === "spot") {
                const spotLight = light[light.type];
                const spLight = new SpotLight(node.light, Vector3.Zero(), Vector3.Zero(), 0, 0, gltfRuntime.scene);
                spLight.name = node.name || "";
                if (spotLight.color) {
                    spLight.diffuse = Color3.FromArray(spotLight.color);
                }
                if (spotLight.fallOfAngle) {
                    spLight.angle = spotLight.fallOfAngle;
                }
                if (spotLight.fallOffExponent) {
                    spLight.exponent = spotLight.fallOffExponent;
                }
                lastNode = spLight;
            }
        }
    }
    // Cameras
    else if (node.camera && !node.babylonNode && !gltfRuntime.importOnlyMeshes) {
        const camera = gltfRuntime.cameras[node.camera];
        if (camera) {
            gltfRuntime.scene._blockEntityCollection = !!gltfRuntime.assetContainer;
            if (camera.type === "orthographic") {
                const orthoCamera = new FreeCamera(node.camera, Vector3.Zero(), gltfRuntime.scene, false);
                orthoCamera.name = node.name || "";
                orthoCamera.mode = Camera.ORTHOGRAPHIC_CAMERA;
                orthoCamera.attachControl();
                lastNode = orthoCamera;
                orthoCamera._parentContainer = gltfRuntime.assetContainer;
            }
            else if (camera.type === "perspective") {
                const perspectiveCamera = camera[camera.type];
                const persCamera = new FreeCamera(node.camera, Vector3.Zero(), gltfRuntime.scene, false);
                persCamera.name = node.name || "";
                persCamera.attachControl();
                if (!perspectiveCamera.aspectRatio) {
                    perspectiveCamera.aspectRatio = gltfRuntime.scene.getEngine().getRenderWidth() / gltfRuntime.scene.getEngine().getRenderHeight();
                }
                if (perspectiveCamera.znear && perspectiveCamera.zfar) {
                    persCamera.maxZ = perspectiveCamera.zfar;
                    persCamera.minZ = perspectiveCamera.znear;
                }
                lastNode = persCamera;
                persCamera._parentContainer = gltfRuntime.assetContainer;
            }
            gltfRuntime.scene._blockEntityCollection = false;
        }
    }
    // Empty node
    if (!node.jointName) {
        if (node.babylonNode) {
            return node.babylonNode;
        }
        else if (lastNode === null) {
            gltfRuntime.scene._blockEntityCollection = !!gltfRuntime.assetContainer;
            const dummy = new Mesh(node.name || "", gltfRuntime.scene);
            dummy._parentContainer = gltfRuntime.assetContainer;
            gltfRuntime.scene._blockEntityCollection = false;
            node.babylonNode = dummy;
            lastNode = dummy;
        }
    }
    if (lastNode !== null) {
        if (node.matrix && lastNode instanceof Mesh) {
            configureNodeFromMatrix(lastNode, node);
        }
        else {
            const translation = node.translation || [0, 0, 0];
            const rotation = node.rotation || [0, 0, 0, 1];
            const scale = node.scale || [1, 1, 1];
            configureNode(lastNode, Vector3.FromArray(translation), Quaternion.FromArray(rotation), Vector3.FromArray(scale));
        }
        lastNode.updateCache(true);
        node.babylonNode = lastNode;
    }
    return lastNode;
};
/**
 * Traverses nodes and creates them
 * @param gltfRuntime
 * @param id
 * @param parent
 * @param meshIncluded
 */
const traverseNodes = (gltfRuntime, id, parent, meshIncluded = false) => {
    const node = gltfRuntime.nodes[id];
    let newNode = null;
    if (gltfRuntime.importOnlyMeshes && !meshIncluded && gltfRuntime.importMeshesNames) {
        if (gltfRuntime.importMeshesNames.indexOf(node.name || "") !== -1 || gltfRuntime.importMeshesNames.length === 0) {
            meshIncluded = true;
        }
        else {
            meshIncluded = false;
        }
    }
    else {
        meshIncluded = true;
    }
    if (!node.jointName && meshIncluded) {
        newNode = importNode(gltfRuntime, node, id);
        if (newNode !== null) {
            newNode.id = id;
            newNode.parent = parent;
        }
    }
    if (node.children) {
        for (let i = 0; i < node.children.length; i++) {
            traverseNodes(gltfRuntime, node.children[i], newNode, meshIncluded);
        }
    }
};
/**
 * do stuff after buffers, shaders are loaded (e.g. hook up materials, load animations, etc.)
 * @param gltfRuntime
 */
const postLoad = (gltfRuntime) => {
    // Nodes
    let currentScene = gltfRuntime.currentScene;
    if (currentScene) {
        for (let i = 0; i < currentScene.nodes.length; i++) {
            traverseNodes(gltfRuntime, currentScene.nodes[i], null);
        }
    }
    else {
        for (const thing in gltfRuntime.scenes) {
            currentScene = gltfRuntime.scenes[thing];
            for (let i = 0; i < currentScene.nodes.length; i++) {
                traverseNodes(gltfRuntime, currentScene.nodes[i], null);
            }
        }
    }
    // Set animations
    loadAnimations(gltfRuntime);
    for (let i = 0; i < gltfRuntime.scene.skeletons.length; i++) {
        const skeleton = gltfRuntime.scene.skeletons[i];
        gltfRuntime.scene.beginAnimation(skeleton, 0, Number.MAX_VALUE, true, 1.0);
    }
};
/**
 * onBind shaderrs callback to set uniforms and matrices
 * @param mesh
 * @param gltfRuntime
 * @param unTreatedUniforms
 * @param shaderMaterial
 * @param technique
 * @param material
 * @param onSuccess
 */
const onBindShaderMaterial = (mesh, gltfRuntime, unTreatedUniforms, shaderMaterial, technique, material, onSuccess) => {
    const materialValues = material.values || technique.parameters;
    for (const unif in unTreatedUniforms) {
        const uniform = unTreatedUniforms[unif];
        const type = uniform.type;
        if (type === EParameterType.FLOAT_MAT2 || type === EParameterType.FLOAT_MAT3 || type === EParameterType.FLOAT_MAT4) {
            if (uniform.semantic && !uniform.source && !uniform.node) {
                GLTFUtils.SetMatrix(gltfRuntime.scene, mesh, uniform, unif, shaderMaterial.getEffect());
            }
            else if (uniform.semantic && (uniform.source || uniform.node)) {
                let source = gltfRuntime.scene.getNodeByName(uniform.source || uniform.node || "");
                if (source === null) {
                    source = gltfRuntime.scene.getNodeById(uniform.source || uniform.node || "");
                }
                if (source === null) {
                    continue;
                }
                GLTFUtils.SetMatrix(gltfRuntime.scene, source, uniform, unif, shaderMaterial.getEffect());
            }
        }
        else {
            const value = materialValues[technique.uniforms[unif]];
            if (!value) {
                continue;
            }
            if (type === EParameterType.SAMPLER_2D) {
                const texture = gltfRuntime.textures[material.values ? value : uniform.value].babylonTexture;
                if (texture === null || texture === undefined) {
                    continue;
                }
                shaderMaterial.getEffect().setTexture(unif, texture);
            }
            else {
                GLTFUtils.SetUniform(shaderMaterial.getEffect(), unif, value, type);
            }
        }
    }
    onSuccess(shaderMaterial);
};
/**
 * Prepare uniforms to send the only one time
 * Loads the appropriate textures
 * @param gltfRuntime
 * @param shaderMaterial
 * @param technique
 * @param material
 */
const prepareShaderMaterialUniforms = (gltfRuntime, shaderMaterial, technique, material, unTreatedUniforms) => {
    const materialValues = material.values || technique.parameters;
    const techniqueUniforms = technique.uniforms;
    /**
     * Prepare values here (not matrices)
     */
    for (const unif in unTreatedUniforms) {
        const uniform = unTreatedUniforms[unif];
        const type = uniform.type;
        let value = materialValues[techniqueUniforms[unif]];
        if (value === undefined) {
            // In case the value is the same for all materials
            value = uniform.value;
        }
        if (!value) {
            continue;
        }
        const onLoadTexture = (uniformName) => {
            return (texture) => {
                if (uniform.value && uniformName) {
                    // Static uniform
                    shaderMaterial.setTexture(uniformName, texture);
                    delete unTreatedUniforms[uniformName];
                }
            };
        };
        // Texture (sampler2D)
        if (type === EParameterType.SAMPLER_2D) {
            GLTFLoaderExtension.LoadTextureAsync(gltfRuntime, material.values ? value : uniform.value, onLoadTexture(unif), () => onLoadTexture(null));
        }
        // Others
        else {
            if (uniform.value && GLTFUtils.SetUniform(shaderMaterial, unif, material.values ? value : uniform.value, type)) {
                // Static uniform
                delete unTreatedUniforms[unif];
            }
        }
    }
};
/**
 * Shader compilation failed
 * @param program
 * @param shaderMaterial
 * @param onError
 * @returns callback when shader is compiled
 */
const onShaderCompileError = (program, shaderMaterial, onError) => {
    return (effect, error) => {
        shaderMaterial.dispose(true);
        onError("Cannot compile program named " + program.name + ". Error: " + error + ". Default material will be applied");
    };
};
/**
 * Shader compilation success
 * @param gltfRuntime
 * @param shaderMaterial
 * @param technique
 * @param material
 * @param unTreatedUniforms
 * @param onSuccess
 * @returns callback when shader is compiled
 */
const onShaderCompileSuccess = (gltfRuntime, shaderMaterial, technique, material, unTreatedUniforms, onSuccess) => {
    return (_) => {
        prepareShaderMaterialUniforms(gltfRuntime, shaderMaterial, technique, material, unTreatedUniforms);
        shaderMaterial.onBind = (mesh) => {
            onBindShaderMaterial(mesh, gltfRuntime, unTreatedUniforms, shaderMaterial, technique, material, onSuccess);
        };
    };
};
/**
 * Returns the appropriate uniform if already handled by babylon
 * @param tokenizer
 * @param technique
 * @param unTreatedUniforms
 * @returns the name of the uniform handled by babylon
 */
const parseShaderUniforms = (tokenizer, technique, unTreatedUniforms) => {
    for (const unif in technique.uniforms) {
        const uniform = technique.uniforms[unif];
        const uniformParameter = technique.parameters[uniform];
        if (tokenizer.currentIdentifier === unif) {
            if (uniformParameter.semantic && !uniformParameter.source && !uniformParameter.node) {
                const transformIndex = glTFTransforms.indexOf(uniformParameter.semantic);
                if (transformIndex !== -1) {
                    delete unTreatedUniforms[unif];
                    return babylonTransforms[transformIndex];
                }
            }
        }
    }
    return tokenizer.currentIdentifier;
};
/**
 * All shaders loaded. Create materials one by one
 * @param gltfRuntime
 */
const importMaterials = (gltfRuntime) => {
    // Create materials
    for (const mat in gltfRuntime.materials) {
        GLTFLoaderExtension.LoadMaterialAsync(gltfRuntime, mat, () => { }, () => { });
    }
};
/**
 * Implementation of the base glTF spec
 * @internal
 */
class GLTFLoaderBase {
    static CreateRuntime(parsedData, scene, rootUrl) {
        const gltfRuntime = {
            extensions: {},
            accessors: {},
            buffers: {},
            bufferViews: {},
            meshes: {},
            lights: {},
            cameras: {},
            nodes: {},
            images: {},
            textures: {},
            shaders: {},
            programs: {},
            samplers: {},
            techniques: {},
            materials: {},
            animations: {},
            skins: {},
            extensionsUsed: [],
            scenes: {},
            buffersCount: 0,
            shaderscount: 0,
            scene: scene,
            rootUrl: rootUrl,
            loadedBufferCount: 0,
            loadedBufferViews: {},
            loadedShaderCount: 0,
            importOnlyMeshes: false,
            dummyNodes: [],
            assetContainer: null,
        };
        // Parse
        if (parsedData.extensions) {
            parseObject(parsedData.extensions, "extensions", gltfRuntime);
        }
        if (parsedData.extensionsUsed) {
            parseObject(parsedData.extensionsUsed, "extensionsUsed", gltfRuntime);
        }
        if (parsedData.buffers) {
            parseBuffers(parsedData.buffers, gltfRuntime);
        }
        if (parsedData.bufferViews) {
            parseObject(parsedData.bufferViews, "bufferViews", gltfRuntime);
        }
        if (parsedData.accessors) {
            parseObject(parsedData.accessors, "accessors", gltfRuntime);
        }
        if (parsedData.meshes) {
            parseObject(parsedData.meshes, "meshes", gltfRuntime);
        }
        if (parsedData.lights) {
            parseObject(parsedData.lights, "lights", gltfRuntime);
        }
        if (parsedData.cameras) {
            parseObject(parsedData.cameras, "cameras", gltfRuntime);
        }
        if (parsedData.nodes) {
            parseObject(parsedData.nodes, "nodes", gltfRuntime);
        }
        if (parsedData.images) {
            parseObject(parsedData.images, "images", gltfRuntime);
        }
        if (parsedData.textures) {
            parseObject(parsedData.textures, "textures", gltfRuntime);
        }
        if (parsedData.shaders) {
            parseShaders(parsedData.shaders, gltfRuntime);
        }
        if (parsedData.programs) {
            parseObject(parsedData.programs, "programs", gltfRuntime);
        }
        if (parsedData.samplers) {
            parseObject(parsedData.samplers, "samplers", gltfRuntime);
        }
        if (parsedData.techniques) {
            parseObject(parsedData.techniques, "techniques", gltfRuntime);
        }
        if (parsedData.materials) {
            parseObject(parsedData.materials, "materials", gltfRuntime);
        }
        if (parsedData.animations) {
            parseObject(parsedData.animations, "animations", gltfRuntime);
        }
        if (parsedData.skins) {
            parseObject(parsedData.skins, "skins", gltfRuntime);
        }
        if (parsedData.scenes) {
            gltfRuntime.scenes = parsedData.scenes;
        }
        if (parsedData.scene && parsedData.scenes) {
            gltfRuntime.currentScene = parsedData.scenes[parsedData.scene];
        }
        return gltfRuntime;
    }
    static LoadBufferAsync(gltfRuntime, id, onSuccess, onError, onProgress) {
        const buffer = gltfRuntime.buffers[id];
        if (Tools.IsBase64(buffer.uri)) {
            setTimeout(() => onSuccess(new Uint8Array(Tools.DecodeBase64(buffer.uri))));
        }
        else {
            Tools.LoadFile(gltfRuntime.rootUrl + buffer.uri, (data) => onSuccess(new Uint8Array(data)), onProgress, undefined, true, (request) => {
                if (request) {
                    onError(request.status + " " + request.statusText);
                }
            });
        }
    }
    static LoadTextureBufferAsync(gltfRuntime, id, onSuccess, onError) {
        const texture = gltfRuntime.textures[id];
        if (!texture || !texture.source) {
            onError("");
            return;
        }
        if (texture.babylonTexture) {
            onSuccess(null);
            return;
        }
        const source = gltfRuntime.images[texture.source];
        if (Tools.IsBase64(source.uri)) {
            setTimeout(() => onSuccess(new Uint8Array(Tools.DecodeBase64(source.uri))));
        }
        else {
            Tools.LoadFile(gltfRuntime.rootUrl + source.uri, (data) => onSuccess(new Uint8Array(data)), undefined, undefined, true, (request) => {
                if (request) {
                    onError(request.status + " " + request.statusText);
                }
            });
        }
    }
    static CreateTextureAsync(gltfRuntime, id, buffer, onSuccess) {
        const texture = gltfRuntime.textures[id];
        if (texture.babylonTexture) {
            onSuccess(texture.babylonTexture);
            return;
        }
        const sampler = gltfRuntime.samplers[texture.sampler];
        const createMipMaps = sampler.minFilter === ETextureFilterType.NEAREST_MIPMAP_NEAREST ||
            sampler.minFilter === ETextureFilterType.NEAREST_MIPMAP_LINEAR ||
            sampler.minFilter === ETextureFilterType.LINEAR_MIPMAP_NEAREST ||
            sampler.minFilter === ETextureFilterType.LINEAR_MIPMAP_LINEAR;
        const samplingMode = Texture.BILINEAR_SAMPLINGMODE;
        const blob = buffer == null ? new Blob() : new Blob([buffer]);
        const blobURL = URL.createObjectURL(blob);
        const revokeBlobURL = () => URL.revokeObjectURL(blobURL);
        const newTexture = new Texture(blobURL, gltfRuntime.scene, !createMipMaps, true, samplingMode, revokeBlobURL, revokeBlobURL);
        if (sampler.wrapS !== undefined) {
            newTexture.wrapU = GLTFUtils.GetWrapMode(sampler.wrapS);
        }
        if (sampler.wrapT !== undefined) {
            newTexture.wrapV = GLTFUtils.GetWrapMode(sampler.wrapT);
        }
        newTexture.name = id;
        texture.babylonTexture = newTexture;
        onSuccess(newTexture);
    }
    static LoadShaderStringAsync(gltfRuntime, id, onSuccess, onError) {
        const shader = gltfRuntime.shaders[id];
        if (Tools.IsBase64(shader.uri)) {
            const shaderString = atob(shader.uri.split(",")[1]);
            if (onSuccess) {
                onSuccess(shaderString);
            }
        }
        else {
            Tools.LoadFile(gltfRuntime.rootUrl + shader.uri, onSuccess, undefined, undefined, false, (request) => {
                if (request && onError) {
                    onError(request.status + " " + request.statusText);
                }
            });
        }
    }
    static LoadMaterialAsync(gltfRuntime, id, onSuccess, onError) {
        const material = gltfRuntime.materials[id];
        if (!material.technique) {
            if (onError) {
                onError("No technique found.");
            }
            return;
        }
        const technique = gltfRuntime.techniques[material.technique];
        if (!technique) {
            gltfRuntime.scene._blockEntityCollection = !!gltfRuntime.assetContainer;
            const defaultMaterial = new StandardMaterial(id, gltfRuntime.scene);
            defaultMaterial._parentContainer = gltfRuntime.assetContainer;
            gltfRuntime.scene._blockEntityCollection = false;
            defaultMaterial.diffuseColor = new Color3(0.5, 0.5, 0.5);
            defaultMaterial.sideOrientation = Material.CounterClockWiseSideOrientation;
            onSuccess(defaultMaterial);
            return;
        }
        const program = gltfRuntime.programs[technique.program];
        const states = technique.states;
        const vertexShader = Effect.ShadersStore[program.vertexShader + "VertexShader"];
        const pixelShader = Effect.ShadersStore[program.fragmentShader + "PixelShader"];
        let newVertexShader = "";
        let newPixelShader = "";
        const vertexTokenizer = new Tokenizer(vertexShader);
        const pixelTokenizer = new Tokenizer(pixelShader);
        const unTreatedUniforms = {};
        const uniforms = [];
        const attributes = [];
        const samplers = [];
        // Fill uniform, sampler2D and attributes
        for (const unif in technique.uniforms) {
            const uniform = technique.uniforms[unif];
            const uniformParameter = technique.parameters[uniform];
            unTreatedUniforms[unif] = uniformParameter;
            if (uniformParameter.semantic && !uniformParameter.node && !uniformParameter.source) {
                const transformIndex = glTFTransforms.indexOf(uniformParameter.semantic);
                if (transformIndex !== -1) {
                    uniforms.push(babylonTransforms[transformIndex]);
                    delete unTreatedUniforms[unif];
                }
                else {
                    uniforms.push(unif);
                }
            }
            else if (uniformParameter.type === EParameterType.SAMPLER_2D) {
                samplers.push(unif);
            }
            else {
                uniforms.push(unif);
            }
        }
        for (const attr in technique.attributes) {
            const attribute = technique.attributes[attr];
            const attributeParameter = technique.parameters[attribute];
            if (attributeParameter.semantic) {
                const name = getAttribute(attributeParameter);
                if (name) {
                    attributes.push(name);
                }
            }
        }
        // Configure vertex shader
        while (!vertexTokenizer.isEnd() && vertexTokenizer.getNextToken()) {
            const tokenType = vertexTokenizer.currentToken;
            if (tokenType !== ETokenType.IDENTIFIER) {
                newVertexShader += vertexTokenizer.currentString;
                continue;
            }
            let foundAttribute = false;
            for (const attr in technique.attributes) {
                const attribute = technique.attributes[attr];
                const attributeParameter = technique.parameters[attribute];
                if (vertexTokenizer.currentIdentifier === attr && attributeParameter.semantic) {
                    newVertexShader += getAttribute(attributeParameter);
                    foundAttribute = true;
                    break;
                }
            }
            if (foundAttribute) {
                continue;
            }
            newVertexShader += parseShaderUniforms(vertexTokenizer, technique, unTreatedUniforms);
        }
        // Configure pixel shader
        while (!pixelTokenizer.isEnd() && pixelTokenizer.getNextToken()) {
            const tokenType = pixelTokenizer.currentToken;
            if (tokenType !== ETokenType.IDENTIFIER) {
                newPixelShader += pixelTokenizer.currentString;
                continue;
            }
            newPixelShader += parseShaderUniforms(pixelTokenizer, technique, unTreatedUniforms);
        }
        // Create shader material
        const shaderPath = {
            vertex: program.vertexShader + id,
            fragment: program.fragmentShader + id,
        };
        const options = {
            attributes: attributes,
            uniforms: uniforms,
            samplers: samplers,
            needAlphaBlending: states && states.enable && states.enable.indexOf(3042) !== -1,
        };
        Effect.ShadersStore[program.vertexShader + id + "VertexShader"] = newVertexShader;
        Effect.ShadersStore[program.fragmentShader + id + "PixelShader"] = newPixelShader;
        const shaderMaterial = new ShaderMaterial(id, gltfRuntime.scene, shaderPath, options);
        shaderMaterial.onError = onShaderCompileError(program, shaderMaterial, onError);
        shaderMaterial.onCompiled = onShaderCompileSuccess(gltfRuntime, shaderMaterial, technique, material, unTreatedUniforms, onSuccess);
        shaderMaterial.sideOrientation = Material.CounterClockWiseSideOrientation;
        if (states && states.functions) {
            const functions = states.functions;
            if (functions.cullFace && functions.cullFace[0] !== ECullingType.BACK) {
                shaderMaterial.backFaceCulling = false;
            }
            const blendFunc = functions.blendFuncSeparate;
            if (blendFunc) {
                if (blendFunc[0] === EBlendingFunction.SRC_ALPHA &&
                    blendFunc[1] === EBlendingFunction.ONE_MINUS_SRC_ALPHA &&
                    blendFunc[2] === EBlendingFunction.ONE &&
                    blendFunc[3] === EBlendingFunction.ONE) {
                    shaderMaterial.alphaMode = Constants.ALPHA_COMBINE;
                }
                else if (blendFunc[0] === EBlendingFunction.ONE &&
                    blendFunc[1] === EBlendingFunction.ONE &&
                    blendFunc[2] === EBlendingFunction.ZERO &&
                    blendFunc[3] === EBlendingFunction.ONE) {
                    shaderMaterial.alphaMode = Constants.ALPHA_ONEONE;
                }
                else if (blendFunc[0] === EBlendingFunction.SRC_ALPHA &&
                    blendFunc[1] === EBlendingFunction.ONE &&
                    blendFunc[2] === EBlendingFunction.ZERO &&
                    blendFunc[3] === EBlendingFunction.ONE) {
                    shaderMaterial.alphaMode = Constants.ALPHA_ADD;
                }
                else if (blendFunc[0] === EBlendingFunction.ZERO &&
                    blendFunc[1] === EBlendingFunction.ONE_MINUS_SRC_COLOR &&
                    blendFunc[2] === EBlendingFunction.ONE &&
                    blendFunc[3] === EBlendingFunction.ONE) {
                    shaderMaterial.alphaMode = Constants.ALPHA_SUBTRACT;
                }
                else if (blendFunc[0] === EBlendingFunction.DST_COLOR &&
                    blendFunc[1] === EBlendingFunction.ZERO &&
                    blendFunc[2] === EBlendingFunction.ONE &&
                    blendFunc[3] === EBlendingFunction.ONE) {
                    shaderMaterial.alphaMode = Constants.ALPHA_MULTIPLY;
                }
                else if (blendFunc[0] === EBlendingFunction.SRC_ALPHA &&
                    blendFunc[1] === EBlendingFunction.ONE_MINUS_SRC_COLOR &&
                    blendFunc[2] === EBlendingFunction.ONE &&
                    blendFunc[3] === EBlendingFunction.ONE) {
                    shaderMaterial.alphaMode = Constants.ALPHA_MAXIMIZED;
                }
            }
        }
    }
}
/**
 * glTF V1 Loader
 * @internal
 * @deprecated
 */
let GLTFLoader$1 = class GLTFLoader {
    static RegisterExtension(extension) {
        if (GLTFLoader.Extensions[extension.name]) {
            Tools.Error('Tool with the same name "' + extension.name + '" already exists');
            return;
        }
        GLTFLoader.Extensions[extension.name] = extension;
    }
    dispose() {
        // do nothing
    }
    _importMeshAsync(meshesNames, scene, data, rootUrl, assetContainer, onSuccess, onProgress, onError) {
        scene.useRightHandedSystem = true;
        GLTFLoaderExtension.LoadRuntimeAsync(scene, data, rootUrl, (gltfRuntime) => {
            gltfRuntime.assetContainer = assetContainer;
            gltfRuntime.importOnlyMeshes = true;
            if (meshesNames === "") {
                gltfRuntime.importMeshesNames = [];
            }
            else if (typeof meshesNames === "string") {
                gltfRuntime.importMeshesNames = [meshesNames];
            }
            else if (meshesNames && !(meshesNames instanceof Array)) {
                gltfRuntime.importMeshesNames = [meshesNames];
            }
            else {
                gltfRuntime.importMeshesNames = [];
                Tools.Warn("Argument meshesNames must be of type string or string[]");
            }
            // Create nodes
            this._createNodes(gltfRuntime);
            const meshes = [];
            const skeletons = [];
            // Fill arrays of meshes and skeletons
            for (const nde in gltfRuntime.nodes) {
                const node = gltfRuntime.nodes[nde];
                if (node.babylonNode instanceof AbstractMesh) {
                    meshes.push(node.babylonNode);
                }
            }
            for (const skl in gltfRuntime.skins) {
                const skin = gltfRuntime.skins[skl];
                if (skin.babylonSkeleton instanceof Skeleton) {
                    skeletons.push(skin.babylonSkeleton);
                }
            }
            // Load buffers, shaders, materials, etc.
            this._loadBuffersAsync(gltfRuntime, () => {
                this._loadShadersAsync(gltfRuntime, () => {
                    importMaterials(gltfRuntime);
                    postLoad(gltfRuntime);
                    if (!GLTFFileLoader.IncrementalLoading && onSuccess) {
                        onSuccess(meshes, skeletons);
                    }
                });
            });
            if (GLTFFileLoader.IncrementalLoading && onSuccess) {
                onSuccess(meshes, skeletons);
            }
        }, onError);
        return true;
    }
    /**
     * Imports one or more meshes from a loaded gltf file and adds them to the scene
     * @param meshesNames a string or array of strings of the mesh names that should be loaded from the file
     * @param scene the scene the meshes should be added to
     * @param assetContainer defines the asset container to use (can be null)
     * @param data gltf data containing information of the meshes in a loaded file
     * @param rootUrl root url to load from
     * @param onProgress event that fires when loading progress has occured
     * @returns a promise containg the loaded meshes, particles, skeletons and animations
     */
    importMeshAsync(meshesNames, scene, assetContainer, data, rootUrl, onProgress) {
        return new Promise((resolve, reject) => {
            this._importMeshAsync(meshesNames, scene, data, rootUrl, assetContainer, (meshes, skeletons) => {
                resolve({
                    meshes: meshes,
                    particleSystems: [],
                    skeletons: skeletons,
                    animationGroups: [],
                    lights: [],
                    transformNodes: [],
                    geometries: [],
                    spriteManagers: [],
                });
            }, onProgress, (message) => {
                reject(new Error(message));
            });
        });
    }
    _loadAsync(scene, data, rootUrl, onSuccess, onProgress, onError) {
        scene.useRightHandedSystem = true;
        GLTFLoaderExtension.LoadRuntimeAsync(scene, data, rootUrl, (gltfRuntime) => {
            // Load runtime extensios
            GLTFLoaderExtension.LoadRuntimeExtensionsAsync(gltfRuntime, () => {
                // Create nodes
                this._createNodes(gltfRuntime);
                // Load buffers, shaders, materials, etc.
                this._loadBuffersAsync(gltfRuntime, () => {
                    this._loadShadersAsync(gltfRuntime, () => {
                        importMaterials(gltfRuntime);
                        postLoad(gltfRuntime);
                        if (!GLTFFileLoader.IncrementalLoading) {
                            onSuccess();
                        }
                    });
                });
                if (GLTFFileLoader.IncrementalLoading) {
                    onSuccess();
                }
            }, onError);
        }, onError);
    }
    /**
     * Imports all objects from a loaded gltf file and adds them to the scene
     * @param scene the scene the objects should be added to
     * @param data gltf data containing information of the meshes in a loaded file
     * @param rootUrl root url to load from
     * @param onProgress event that fires when loading progress has occured
     * @returns a promise which completes when objects have been loaded to the scene
     */
    loadAsync(scene, data, rootUrl, onProgress) {
        return new Promise((resolve, reject) => {
            this._loadAsync(scene, data, rootUrl, () => {
                resolve();
            }, onProgress, (message) => {
                reject(new Error(message));
            });
        });
    }
    _loadShadersAsync(gltfRuntime, onload) {
        let hasShaders = false;
        const processShader = (sha, shader) => {
            GLTFLoaderExtension.LoadShaderStringAsync(gltfRuntime, sha, (shaderString) => {
                if (shaderString instanceof ArrayBuffer) {
                    return;
                }
                gltfRuntime.loadedShaderCount++;
                if (shaderString) {
                    Effect.ShadersStore[sha + (shader.type === EShaderType.VERTEX ? "VertexShader" : "PixelShader")] = shaderString;
                }
                if (gltfRuntime.loadedShaderCount === gltfRuntime.shaderscount) {
                    onload();
                }
            }, () => {
                Tools.Error("Error when loading shader program named " + sha + " located at " + shader.uri);
            });
        };
        for (const sha in gltfRuntime.shaders) {
            hasShaders = true;
            const shader = gltfRuntime.shaders[sha];
            if (shader) {
                processShader.bind(this, sha, shader)();
            }
            else {
                Tools.Error("No shader named: " + sha);
            }
        }
        if (!hasShaders) {
            onload();
        }
    }
    _loadBuffersAsync(gltfRuntime, onLoad) {
        let hasBuffers = false;
        const processBuffer = (buf, buffer) => {
            GLTFLoaderExtension.LoadBufferAsync(gltfRuntime, buf, (bufferView) => {
                gltfRuntime.loadedBufferCount++;
                if (bufferView) {
                    if (bufferView.byteLength != gltfRuntime.buffers[buf].byteLength) {
                        Tools.Error("Buffer named " + buf + " is length " + bufferView.byteLength + ". Expected: " + buffer.byteLength); // Improve error message
                    }
                    gltfRuntime.loadedBufferViews[buf] = bufferView;
                }
                if (gltfRuntime.loadedBufferCount === gltfRuntime.buffersCount) {
                    onLoad();
                }
            }, () => {
                Tools.Error("Error when loading buffer named " + buf + " located at " + buffer.uri);
            });
        };
        for (const buf in gltfRuntime.buffers) {
            hasBuffers = true;
            const buffer = gltfRuntime.buffers[buf];
            if (buffer) {
                processBuffer.bind(this, buf, buffer)();
            }
            else {
                Tools.Error("No buffer named: " + buf);
            }
        }
        if (!hasBuffers) {
            onLoad();
        }
    }
    _createNodes(gltfRuntime) {
        let currentScene = gltfRuntime.currentScene;
        if (currentScene) {
            // Only one scene even if multiple scenes are defined
            for (let i = 0; i < currentScene.nodes.length; i++) {
                traverseNodes(gltfRuntime, currentScene.nodes[i], null);
            }
        }
        else {
            // Load all scenes
            for (const thing in gltfRuntime.scenes) {
                currentScene = gltfRuntime.scenes[thing];
                for (let i = 0; i < currentScene.nodes.length; i++) {
                    traverseNodes(gltfRuntime, currentScene.nodes[i], null);
                }
            }
        }
    }
};
GLTFLoader$1.Extensions = {};
/** @internal */
class GLTFLoaderExtension {
    constructor(name) {
        this._name = name;
    }
    get name() {
        return this._name;
    }
    /**
     * Defines an override for loading the runtime
     * Return true to stop further extensions from loading the runtime
     * @param scene
     * @param data
     * @param rootUrl
     * @param onSuccess
     * @param onError
     * @returns true to stop further extensions from loading the runtime
     */
    loadRuntimeAsync(scene, data, rootUrl, onSuccess, onError) {
        return false;
    }
    /**
     * Defines an onverride for creating gltf runtime
     * Return true to stop further extensions from creating the runtime
     * @param gltfRuntime
     * @param onSuccess
     * @param onError
     * @returns true to stop further extensions from creating the runtime
     */
    loadRuntimeExtensionsAsync(gltfRuntime, onSuccess, onError) {
        return false;
    }
    /**
     * Defines an override for loading buffers
     * Return true to stop further extensions from loading this buffer
     * @param gltfRuntime
     * @param id
     * @param onSuccess
     * @param onError
     * @param onProgress
     * @returns true to stop further extensions from loading this buffer
     */
    loadBufferAsync(gltfRuntime, id, onSuccess, onError, onProgress) {
        return false;
    }
    /**
     * Defines an override for loading texture buffers
     * Return true to stop further extensions from loading this texture data
     * @param gltfRuntime
     * @param id
     * @param onSuccess
     * @param onError
     * @returns true to stop further extensions from loading this texture data
     */
    loadTextureBufferAsync(gltfRuntime, id, onSuccess, onError) {
        return false;
    }
    /**
     * Defines an override for creating textures
     * Return true to stop further extensions from loading this texture
     * @param gltfRuntime
     * @param id
     * @param buffer
     * @param onSuccess
     * @param onError
     * @returns true to stop further extensions from loading this texture
     */
    createTextureAsync(gltfRuntime, id, buffer, onSuccess, onError) {
        return false;
    }
    /**
     * Defines an override for loading shader strings
     * Return true to stop further extensions from loading this shader data
     * @param gltfRuntime
     * @param id
     * @param onSuccess
     * @param onError
     * @returns true to stop further extensions from loading this shader data
     */
    loadShaderStringAsync(gltfRuntime, id, onSuccess, onError) {
        return false;
    }
    /**
     * Defines an override for loading materials
     * Return true to stop further extensions from loading this material
     * @param gltfRuntime
     * @param id
     * @param onSuccess
     * @param onError
     * @returns true to stop further extensions from loading this material
     */
    loadMaterialAsync(gltfRuntime, id, onSuccess, onError) {
        return false;
    }
    // ---------
    // Utilities
    // ---------
    static LoadRuntimeAsync(scene, data, rootUrl, onSuccess, onError) {
        GLTFLoaderExtension._ApplyExtensions((loaderExtension) => {
            return loaderExtension.loadRuntimeAsync(scene, data, rootUrl, onSuccess, onError);
        }, () => {
            setTimeout(() => {
                if (!onSuccess) {
                    return;
                }
                onSuccess(GLTFLoaderBase.CreateRuntime(data.json, scene, rootUrl));
            });
        });
    }
    static LoadRuntimeExtensionsAsync(gltfRuntime, onSuccess, onError) {
        GLTFLoaderExtension._ApplyExtensions((loaderExtension) => {
            return loaderExtension.loadRuntimeExtensionsAsync(gltfRuntime, onSuccess, onError);
        }, () => {
            setTimeout(() => {
                onSuccess();
            });
        });
    }
    static LoadBufferAsync(gltfRuntime, id, onSuccess, onError, onProgress) {
        GLTFLoaderExtension._ApplyExtensions((loaderExtension) => {
            return loaderExtension.loadBufferAsync(gltfRuntime, id, onSuccess, onError, onProgress);
        }, () => {
            GLTFLoaderBase.LoadBufferAsync(gltfRuntime, id, onSuccess, onError, onProgress);
        });
    }
    static LoadTextureAsync(gltfRuntime, id, onSuccess, onError) {
        GLTFLoaderExtension._LoadTextureBufferAsync(gltfRuntime, id, (buffer) => {
            if (buffer) {
                GLTFLoaderExtension._CreateTextureAsync(gltfRuntime, id, buffer, onSuccess, onError);
            }
        }, onError);
    }
    static LoadShaderStringAsync(gltfRuntime, id, onSuccess, onError) {
        GLTFLoaderExtension._ApplyExtensions((loaderExtension) => {
            return loaderExtension.loadShaderStringAsync(gltfRuntime, id, onSuccess, onError);
        }, () => {
            GLTFLoaderBase.LoadShaderStringAsync(gltfRuntime, id, onSuccess, onError);
        });
    }
    static LoadMaterialAsync(gltfRuntime, id, onSuccess, onError) {
        GLTFLoaderExtension._ApplyExtensions((loaderExtension) => {
            return loaderExtension.loadMaterialAsync(gltfRuntime, id, onSuccess, onError);
        }, () => {
            GLTFLoaderBase.LoadMaterialAsync(gltfRuntime, id, onSuccess, onError);
        });
    }
    static _LoadTextureBufferAsync(gltfRuntime, id, onSuccess, onError) {
        GLTFLoaderExtension._ApplyExtensions((loaderExtension) => {
            return loaderExtension.loadTextureBufferAsync(gltfRuntime, id, onSuccess, onError);
        }, () => {
            GLTFLoaderBase.LoadTextureBufferAsync(gltfRuntime, id, onSuccess, onError);
        });
    }
    static _CreateTextureAsync(gltfRuntime, id, buffer, onSuccess, onError) {
        GLTFLoaderExtension._ApplyExtensions((loaderExtension) => {
            return loaderExtension.createTextureAsync(gltfRuntime, id, buffer, onSuccess, onError);
        }, () => {
            GLTFLoaderBase.CreateTextureAsync(gltfRuntime, id, buffer, onSuccess);
        });
    }
    static _ApplyExtensions(func, defaultFunc) {
        for (const extensionName in GLTFLoader$1.Extensions) {
            const loaderExtension = GLTFLoader$1.Extensions[extensionName];
            if (func(loaderExtension)) {
                return;
            }
        }
        defaultFunc();
    }
}
GLTFFileLoader._CreateGLTF1Loader = () => new GLTFLoader$1();

const BinaryExtensionBufferName = "binary_glTF";
/**
 * @internal
 * @deprecated
 */
class GLTFBinaryExtension extends GLTFLoaderExtension {
    constructor() {
        super("KHR_binary_glTF");
    }
    loadRuntimeAsync(scene, data, rootUrl, onSuccess) {
        const extensionsUsed = data.json.extensionsUsed;
        if (!extensionsUsed || extensionsUsed.indexOf(this.name) === -1 || !data.bin) {
            return false;
        }
        this._bin = data.bin;
        onSuccess(GLTFLoaderBase.CreateRuntime(data.json, scene, rootUrl));
        return true;
    }
    loadBufferAsync(gltfRuntime, id, onSuccess, onError) {
        if (gltfRuntime.extensionsUsed.indexOf(this.name) === -1) {
            return false;
        }
        if (id !== BinaryExtensionBufferName) {
            return false;
        }
        this._bin.readAsync(0, this._bin.byteLength).then(onSuccess, (error) => onError(error.message));
        return true;
    }
    loadTextureBufferAsync(gltfRuntime, id, onSuccess) {
        const texture = gltfRuntime.textures[id];
        const source = gltfRuntime.images[texture.source];
        if (!source.extensions || !(this.name in source.extensions)) {
            return false;
        }
        const sourceExt = source.extensions[this.name];
        const bufferView = gltfRuntime.bufferViews[sourceExt.bufferView];
        const buffer = GLTFUtils.GetBufferFromBufferView(gltfRuntime, bufferView, 0, bufferView.byteLength, EComponentType.UNSIGNED_BYTE);
        onSuccess(buffer);
        return true;
    }
    loadShaderStringAsync(gltfRuntime, id, onSuccess) {
        const shader = gltfRuntime.shaders[id];
        if (!shader.extensions || !(this.name in shader.extensions)) {
            return false;
        }
        const binaryExtensionShader = shader.extensions[this.name];
        const bufferView = gltfRuntime.bufferViews[binaryExtensionShader.bufferView];
        const shaderBytes = GLTFUtils.GetBufferFromBufferView(gltfRuntime, bufferView, 0, bufferView.byteLength, EComponentType.UNSIGNED_BYTE);
        setTimeout(() => {
            const shaderString = GLTFUtils.DecodeBufferToText(shaderBytes);
            onSuccess(shaderString);
        });
        return true;
    }
}
GLTFLoader$1.RegisterExtension(new GLTFBinaryExtension());

/**
 * @internal
 * @deprecated
 */
class GLTFMaterialsCommonExtension extends GLTFLoaderExtension {
    constructor() {
        super("KHR_materials_common");
    }
    loadRuntimeExtensionsAsync(gltfRuntime) {
        if (!gltfRuntime.extensions) {
            return false;
        }
        const extension = gltfRuntime.extensions[this.name];
        if (!extension) {
            return false;
        }
        // Create lights
        const lights = extension.lights;
        if (lights) {
            for (const thing in lights) {
                const light = lights[thing];
                switch (light.type) {
                    case "ambient": {
                        const ambientLight = new HemisphericLight(light.name, new Vector3(0, 1, 0), gltfRuntime.scene);
                        const ambient = light.ambient;
                        if (ambient) {
                            ambientLight.diffuse = Color3.FromArray(ambient.color || [1, 1, 1]);
                        }
                        break;
                    }
                    case "point": {
                        const pointLight = new PointLight(light.name, new Vector3(10, 10, 10), gltfRuntime.scene);
                        const point = light.point;
                        if (point) {
                            pointLight.diffuse = Color3.FromArray(point.color || [1, 1, 1]);
                        }
                        break;
                    }
                    case "directional": {
                        const dirLight = new DirectionalLight(light.name, new Vector3(0, -1, 0), gltfRuntime.scene);
                        const directional = light.directional;
                        if (directional) {
                            dirLight.diffuse = Color3.FromArray(directional.color || [1, 1, 1]);
                        }
                        break;
                    }
                    case "spot": {
                        const spot = light.spot;
                        if (spot) {
                            const spotLight = new SpotLight(light.name, new Vector3(0, 10, 0), new Vector3(0, -1, 0), spot.fallOffAngle || Math.PI, spot.fallOffExponent || 0.0, gltfRuntime.scene);
                            spotLight.diffuse = Color3.FromArray(spot.color || [1, 1, 1]);
                        }
                        break;
                    }
                    default:
                        Tools.Warn('GLTF Material Common extension: light type "' + light.type + "” not supported");
                        break;
                }
            }
        }
        return false;
    }
    loadMaterialAsync(gltfRuntime, id, onSuccess, onError) {
        const material = gltfRuntime.materials[id];
        if (!material || !material.extensions) {
            return false;
        }
        const extension = material.extensions[this.name];
        if (!extension) {
            return false;
        }
        const standardMaterial = new StandardMaterial(id, gltfRuntime.scene);
        standardMaterial.sideOrientation = Material.CounterClockWiseSideOrientation;
        if (extension.technique === "CONSTANT") {
            standardMaterial.disableLighting = true;
        }
        standardMaterial.backFaceCulling = extension.doubleSided === undefined ? false : !extension.doubleSided;
        standardMaterial.alpha = extension.values.transparency === undefined ? 1.0 : extension.values.transparency;
        standardMaterial.specularPower = extension.values.shininess === undefined ? 0.0 : extension.values.shininess;
        // Ambient
        if (typeof extension.values.ambient === "string") {
            this._loadTexture(gltfRuntime, extension.values.ambient, standardMaterial, "ambientTexture", onError);
        }
        else {
            standardMaterial.ambientColor = Color3.FromArray(extension.values.ambient || [0, 0, 0]);
        }
        // Diffuse
        if (typeof extension.values.diffuse === "string") {
            this._loadTexture(gltfRuntime, extension.values.diffuse, standardMaterial, "diffuseTexture", onError);
        }
        else {
            standardMaterial.diffuseColor = Color3.FromArray(extension.values.diffuse || [0, 0, 0]);
        }
        // Emission
        if (typeof extension.values.emission === "string") {
            this._loadTexture(gltfRuntime, extension.values.emission, standardMaterial, "emissiveTexture", onError);
        }
        else {
            standardMaterial.emissiveColor = Color3.FromArray(extension.values.emission || [0, 0, 0]);
        }
        // Specular
        if (typeof extension.values.specular === "string") {
            this._loadTexture(gltfRuntime, extension.values.specular, standardMaterial, "specularTexture", onError);
        }
        else {
            standardMaterial.specularColor = Color3.FromArray(extension.values.specular || [0, 0, 0]);
        }
        return true;
    }
    _loadTexture(gltfRuntime, id, material, propertyPath, onError) {
        // Create buffer from texture url
        GLTFLoaderBase.LoadTextureBufferAsync(gltfRuntime, id, (buffer) => {
            // Create texture from buffer
            GLTFLoaderBase.CreateTextureAsync(gltfRuntime, id, buffer, (texture) => (material[propertyPath] = texture));
        }, onError);
    }
}
GLTFLoader$1.RegisterExtension(new GLTFMaterialsCommonExtension());

var index$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    get EBlendingFunction () { return EBlendingFunction; },
    get EComponentType () { return EComponentType; },
    get ECullingType () { return ECullingType; },
    get EParameterType () { return EParameterType; },
    get EShaderType () { return EShaderType; },
    get ETextureFilterType () { return ETextureFilterType; },
    get ETextureFormat () { return ETextureFormat; },
    get ETextureWrapMode () { return ETextureWrapMode; },
    GLTFBinaryExtension: GLTFBinaryExtension,
    GLTFLoader: GLTFLoader$1,
    GLTFLoaderBase: GLTFLoaderBase,
    GLTFLoaderExtension: GLTFLoaderExtension,
    GLTFMaterialsCommonExtension: GLTFMaterialsCommonExtension,
    GLTFUtils: GLTFUtils
});

/** @internal */
function getVector3(_target, source, offset, scale) {
    return Vector3.FromArray(source, offset).scaleInPlace(scale);
}
/** @internal */
function getQuaternion(_target, source, offset, scale) {
    return Quaternion.FromArray(source, offset).scaleInPlace(scale);
}
/** @internal */
function getWeights(target, source, offset, scale) {
    const value = new Array(target._numMorphTargets);
    for (let i = 0; i < value.length; i++) {
        value[i] = source[offset++] * scale;
    }
    return value;
}
/** @internal */
class AnimationPropertyInfo {
    /** @internal */
    constructor(type, name, getValue, getStride) {
        this.type = type;
        this.name = name;
        this.getValue = getValue;
        this.getStride = getStride;
    }
    _buildAnimation(name, fps, keys) {
        const babylonAnimation = new Animation(name, this.name, fps, this.type);
        babylonAnimation.setKeys(keys);
        return babylonAnimation;
    }
}
/** @internal */
class TransformNodeAnimationPropertyInfo extends AnimationPropertyInfo {
    /** @internal */
    buildAnimations(target, name, fps, keys, callback) {
        callback(target._babylonTransformNode, this._buildAnimation(name, fps, keys));
    }
}
/** @internal */
class WeightAnimationPropertyInfo extends AnimationPropertyInfo {
    buildAnimations(target, name, fps, keys, callback) {
        if (target._numMorphTargets) {
            for (let targetIndex = 0; targetIndex < target._numMorphTargets; targetIndex++) {
                const babylonAnimation = new Animation(`${name}_${targetIndex}`, this.name, fps, this.type);
                babylonAnimation.setKeys(keys.map((key) => ({
                    frame: key.frame,
                    inTangent: key.inTangent ? key.inTangent[targetIndex] : undefined,
                    value: key.value[targetIndex],
                    outTangent: key.outTangent ? key.outTangent[targetIndex] : undefined,
                    interpolation: key.interpolation,
                })));
                if (target._primitiveBabylonMeshes) {
                    for (const babylonMesh of target._primitiveBabylonMeshes) {
                        if (babylonMesh.morphTargetManager) {
                            const morphTarget = babylonMesh.morphTargetManager.getTarget(targetIndex);
                            const babylonAnimationClone = babylonAnimation.clone();
                            morphTarget.animations.push(babylonAnimationClone);
                            callback(morphTarget, babylonAnimationClone);
                        }
                    }
                }
            }
        }
    }
}
/** @internal */
const nodeAnimationData = {
    translation: [new TransformNodeAnimationPropertyInfo(Animation.ANIMATIONTYPE_VECTOR3, "position", getVector3, () => 3)],
    rotation: [new TransformNodeAnimationPropertyInfo(Animation.ANIMATIONTYPE_QUATERNION, "rotationQuaternion", getQuaternion, () => 4)],
    scale: [new TransformNodeAnimationPropertyInfo(Animation.ANIMATIONTYPE_VECTOR3, "scaling", getVector3, () => 3)],
    weights: [new WeightAnimationPropertyInfo(Animation.ANIMATIONTYPE_FLOAT, "influence", getWeights, (target) => target._numMorphTargets)],
};

const _registeredGLTFExtensions = new Map();
/**
 * All currently registered glTF 2.0 loader extensions.
 */
const registeredGLTFExtensions = _registeredGLTFExtensions;
/**
 * Registers a loader extension.
 * @param name The name of the loader extension.
 * @param isGLTFExtension If the loader extension is a glTF extension, then it will only be used for glTF files that use the corresponding glTF extension. Otherwise, it will be used for all loaded glTF files.
 * @param factory The factory function that creates the loader extension.
 */
function registerGLTFExtension(name, isGLTFExtension, factory) {
    if (unregisterGLTFExtension(name)) {
        Logger.Warn(`Extension with the name '${name}' already exists`);
    }
    _registeredGLTFExtensions.set(name, {
        isGLTFExtension,
        factory,
    });
}
/**
 * Unregisters a loader extension.
 * @param name The name of the loader extension.
 * @returns A boolean indicating whether the extension has been unregistered
 */
function unregisterGLTFExtension(name) {
    return _registeredGLTFExtensions.delete(name);
}

/**
 * Helper class for working with arrays when loading the glTF asset
 */
class ArrayItem {
    /**
     * Gets an item from the given array.
     * @param context The context when loading the asset
     * @param array The array to get the item from
     * @param index The index to the array
     * @returns The array item
     */
    static Get(context, array, index) {
        if (!array || index == undefined || !array[index]) {
            throw new Error(`${context}: Failed to find index (${index})`);
        }
        return array[index];
    }
    /**
     * Gets an item from the given array or returns null if not available.
     * @param array The array to get the item from
     * @param index The index to the array
     * @returns The array item or null
     */
    static TryGet(array, index) {
        if (!array || index == undefined || !array[index]) {
            return null;
        }
        return array[index];
    }
    /**
     * Assign an `index` field to each item of the given array.
     * @param array The array of items
     */
    static Assign(array) {
        if (array) {
            for (let index = 0; index < array.length; index++) {
                array[index].index = index;
            }
        }
    }
}
/** @internal */
function LoadBoundingInfoFromPositionAccessor(accessor) {
    if (accessor.min && accessor.max) {
        const minArray = accessor.min;
        const maxArray = accessor.max;
        const minVector = TmpVectors.Vector3[0].copyFromFloats(minArray[0], minArray[1], minArray[2]);
        const maxVector = TmpVectors.Vector3[1].copyFromFloats(maxArray[0], maxArray[1], maxArray[2]);
        if (accessor.normalized && accessor.componentType !== 5126 /* AccessorComponentType.FLOAT */) {
            let divider = 1;
            switch (accessor.componentType) {
                case 5120 /* AccessorComponentType.BYTE */:
                    divider = 127.0;
                    break;
                case 5121 /* AccessorComponentType.UNSIGNED_BYTE */:
                    divider = 255.0;
                    break;
                case 5122 /* AccessorComponentType.SHORT */:
                    divider = 32767.0;
                    break;
                case 5123 /* AccessorComponentType.UNSIGNED_SHORT */:
                    divider = 65535.0;
                    break;
            }
            const oneOverDivider = 1 / divider;
            minVector.scaleInPlace(oneOverDivider);
            maxVector.scaleInPlace(oneOverDivider);
        }
        return new BoundingInfo(minVector, maxVector);
    }
    return null;
}
/**
 * The glTF 2.0 loader
 */
class GLTFLoader {
    /**
     * Registers a loader extension.
     * @param name The name of the loader extension.
     * @param factory The factory function that creates the loader extension.
     * @deprecated Please use registerGLTFExtension instead.
     */
    static RegisterExtension(name, factory) {
        registerGLTFExtension(name, false, factory);
    }
    /**
     * Unregisters a loader extension.
     * @param name The name of the loader extension.
     * @returns A boolean indicating whether the extension has been unregistered
     * @deprecated Please use unregisterGLTFExtension instead.
     */
    static UnregisterExtension(name) {
        return unregisterGLTFExtension(name);
    }
    /**
     * The object that represents the glTF JSON.
     */
    get gltf() {
        if (!this._gltf) {
            throw new Error("glTF JSON is not available");
        }
        return this._gltf;
    }
    /**
     * The BIN chunk of a binary glTF.
     */
    get bin() {
        return this._bin;
    }
    /**
     * The parent file loader.
     */
    get parent() {
        return this._parent;
    }
    /**
     * The Babylon scene when loading the asset.
     */
    get babylonScene() {
        if (!this._babylonScene) {
            throw new Error("Scene is not available");
        }
        return this._babylonScene;
    }
    /**
     * The root Babylon node when loading the asset.
     */
    get rootBabylonMesh() {
        return this._rootBabylonMesh;
    }
    /**
     * The root url when loading the asset.
     */
    get rootUrl() {
        return this._rootUrl;
    }
    /**
     * @internal
     */
    constructor(parent) {
        /** @internal */
        this._completePromises = new Array();
        /** @internal */
        this._assetContainer = null;
        /** Storage */
        this._babylonLights = [];
        /** @internal */
        this._disableInstancedMesh = 0;
        /** @internal */
        this._allMaterialsDirtyRequired = false;
        this._extensions = new Array();
        this._disposed = false;
        this._rootUrl = null;
        this._fileName = null;
        this._uniqueRootUrl = null;
        this._bin = null;
        this._rootBabylonMesh = null;
        this._defaultBabylonMaterialData = {};
        this._postSceneLoadActions = new Array();
        this._parent = parent;
    }
    /** @internal */
    dispose() {
        if (this._disposed) {
            return;
        }
        this._disposed = true;
        this._completePromises.length = 0;
        this._extensions.forEach((extension) => extension.dispose && extension.dispose());
        this._extensions.length = 0;
        this._gltf = null; // TODO
        this._bin = null;
        this._babylonScene = null; // TODO
        this._rootBabylonMesh = null;
        this._defaultBabylonMaterialData = {};
        this._postSceneLoadActions.length = 0;
        this._parent.dispose();
    }
    /**
     * @internal
     */
    importMeshAsync(meshesNames, scene, container, data, rootUrl, onProgress, fileName = "") {
        return Promise.resolve().then(() => {
            this._babylonScene = scene;
            this._assetContainer = container;
            this._loadData(data);
            let nodes = null;
            if (meshesNames) {
                const nodeMap = {};
                if (this._gltf.nodes) {
                    for (const node of this._gltf.nodes) {
                        if (node.name) {
                            nodeMap[node.name] = node.index;
                        }
                    }
                }
                const names = meshesNames instanceof Array ? meshesNames : [meshesNames];
                nodes = names.map((name) => {
                    const node = nodeMap[name];
                    if (node === undefined) {
                        throw new Error(`Failed to find node '${name}'`);
                    }
                    return node;
                });
            }
            return this._loadAsync(rootUrl, fileName, nodes, () => {
                return {
                    meshes: this._getMeshes(),
                    particleSystems: [],
                    skeletons: this._getSkeletons(),
                    animationGroups: this._getAnimationGroups(),
                    lights: this._babylonLights,
                    transformNodes: this._getTransformNodes(),
                    geometries: this._getGeometries(),
                    spriteManagers: [],
                };
            });
        });
    }
    /**
     * @internal
     */
    loadAsync(scene, data, rootUrl, onProgress, fileName = "") {
        return Promise.resolve().then(() => {
            this._babylonScene = scene;
            this._loadData(data);
            return this._loadAsync(rootUrl, fileName, null, () => undefined);
        });
    }
    _loadAsync(rootUrl, fileName, nodes, resultFunc) {
        return Promise.resolve()
            .then(async () => {
            this._rootUrl = rootUrl;
            this._uniqueRootUrl = !rootUrl.startsWith("file:") && fileName ? rootUrl : `${rootUrl}${Date.now()}/`;
            this._fileName = fileName;
            this._allMaterialsDirtyRequired = false;
            await this._loadExtensionsAsync();
            const loadingToReadyCounterName = `${GLTFLoaderState[GLTFLoaderState.LOADING]} => ${GLTFLoaderState[GLTFLoaderState.READY]}`;
            const loadingToCompleteCounterName = `${GLTFLoaderState[GLTFLoaderState.LOADING]} => ${GLTFLoaderState[GLTFLoaderState.COMPLETE]}`;
            this._parent._startPerformanceCounter(loadingToReadyCounterName);
            this._parent._startPerformanceCounter(loadingToCompleteCounterName);
            this._parent._setState(GLTFLoaderState.LOADING);
            this._extensionsOnLoading();
            const promises = new Array();
            // Block the marking of materials dirty until the scene is loaded.
            const oldBlockMaterialDirtyMechanism = this._babylonScene.blockMaterialDirtyMechanism;
            this._babylonScene.blockMaterialDirtyMechanism = true;
            if (!this.parent.loadOnlyMaterials) {
                if (nodes) {
                    promises.push(this.loadSceneAsync("/nodes", { nodes: nodes, index: -1 }));
                }
                else if (this._gltf.scene != undefined || (this._gltf.scenes && this._gltf.scenes[0])) {
                    const scene = ArrayItem.Get(`/scene`, this._gltf.scenes, this._gltf.scene || 0);
                    promises.push(this.loadSceneAsync(`/scenes/${scene.index}`, scene));
                }
            }
            if (!this.parent.skipMaterials && this.parent.loadAllMaterials && this._gltf.materials) {
                for (let m = 0; m < this._gltf.materials.length; ++m) {
                    const material = this._gltf.materials[m];
                    const context = "/materials/" + m;
                    const babylonDrawMode = Material.TriangleFillMode;
                    promises.push(this._loadMaterialAsync(context, material, null, babylonDrawMode, () => { }));
                }
            }
            // Restore the blocking of material dirty.
            if (this._allMaterialsDirtyRequired) {
                // This can happen if we add a light for instance as it will impact the whole scene.
                // This automatically resets everything if needed.
                this._babylonScene.blockMaterialDirtyMechanism = oldBlockMaterialDirtyMechanism;
            }
            else {
                // By default a newly created material is dirty so there is no need to flag the full scene as dirty.
                // For perf reasons, we then bypass blockMaterialDirtyMechanism as this would "dirty" the entire scene.
                this._babylonScene._forceBlockMaterialDirtyMechanism(oldBlockMaterialDirtyMechanism);
            }
            if (this._parent.compileMaterials) {
                promises.push(this._compileMaterialsAsync());
            }
            if (this._parent.compileShadowGenerators) {
                promises.push(this._compileShadowGeneratorsAsync());
            }
            const resultPromise = Promise.all(promises).then(() => {
                if (this._rootBabylonMesh && this._rootBabylonMesh !== this._parent.customRootNode) {
                    this._rootBabylonMesh.setEnabled(true);
                }
                // Making sure we enable enough lights to have all lights together
                for (const material of this._babylonScene.materials) {
                    const mat = material;
                    if (mat.maxSimultaneousLights !== undefined) {
                        mat.maxSimultaneousLights = Math.max(mat.maxSimultaneousLights, this._babylonScene.lights.length);
                    }
                }
                this._extensionsOnReady();
                this._parent._setState(GLTFLoaderState.READY);
                this._startAnimations();
                return resultFunc();
            });
            return resultPromise.then((result) => {
                this._parent._endPerformanceCounter(loadingToReadyCounterName);
                Tools.SetImmediate(() => {
                    if (!this._disposed) {
                        Promise.all(this._completePromises).then(() => {
                            this._parent._endPerformanceCounter(loadingToCompleteCounterName);
                            this._parent._setState(GLTFLoaderState.COMPLETE);
                            this._parent.onCompleteObservable.notifyObservers(undefined);
                            this._parent.onCompleteObservable.clear();
                            this.dispose();
                        }, (error) => {
                            this._parent.onErrorObservable.notifyObservers(error);
                            this._parent.onErrorObservable.clear();
                            this.dispose();
                        });
                    }
                });
                return result;
            });
        })
            .catch((error) => {
            if (!this._disposed) {
                this._parent.onErrorObservable.notifyObservers(error);
                this._parent.onErrorObservable.clear();
                this.dispose();
            }
            throw error;
        });
    }
    _loadData(data) {
        this._gltf = data.json;
        this._setupData();
        if (data.bin) {
            const buffers = this._gltf.buffers;
            if (buffers && buffers[0] && !buffers[0].uri) {
                const binaryBuffer = buffers[0];
                if (binaryBuffer.byteLength < data.bin.byteLength - 3 || binaryBuffer.byteLength > data.bin.byteLength) {
                    Logger.Warn(`Binary buffer length (${binaryBuffer.byteLength}) from JSON does not match chunk length (${data.bin.byteLength})`);
                }
                this._bin = data.bin;
            }
            else {
                Logger.Warn("Unexpected BIN chunk");
            }
        }
    }
    _setupData() {
        ArrayItem.Assign(this._gltf.accessors);
        ArrayItem.Assign(this._gltf.animations);
        ArrayItem.Assign(this._gltf.buffers);
        ArrayItem.Assign(this._gltf.bufferViews);
        ArrayItem.Assign(this._gltf.cameras);
        ArrayItem.Assign(this._gltf.images);
        ArrayItem.Assign(this._gltf.materials);
        ArrayItem.Assign(this._gltf.meshes);
        ArrayItem.Assign(this._gltf.nodes);
        ArrayItem.Assign(this._gltf.samplers);
        ArrayItem.Assign(this._gltf.scenes);
        ArrayItem.Assign(this._gltf.skins);
        ArrayItem.Assign(this._gltf.textures);
        if (this._gltf.nodes) {
            const nodeParents = {};
            for (const node of this._gltf.nodes) {
                if (node.children) {
                    for (const index of node.children) {
                        nodeParents[index] = node.index;
                    }
                }
            }
            const rootNode = this._createRootNode();
            for (const node of this._gltf.nodes) {
                const parentIndex = nodeParents[node.index];
                node.parent = parentIndex === undefined ? rootNode : this._gltf.nodes[parentIndex];
            }
        }
    }
    async _loadExtensionsAsync() {
        const extensionPromises = [];
        registeredGLTFExtensions.forEach((registeredExtension, name) => {
            // Don't load explicitly disabled extensions.
            if (this.parent.extensionOptions[name]?.enabled === false) {
                // But warn if the disabled extension is used by the model.
                if (registeredExtension.isGLTFExtension && this.isExtensionUsed(name)) {
                    Logger.Warn(`Extension ${name} is used but has been explicitly disabled.`);
                }
            }
            // Load loader extensions that are not a glTF extension, as well as extensions that are glTF extensions and are used by the model.
            else if (!registeredExtension.isGLTFExtension || this.isExtensionUsed(name)) {
                extensionPromises.push((async () => {
                    const extension = await registeredExtension.factory(this);
                    if (extension.name !== name) {
                        Logger.Warn(`The name of the glTF loader extension instance does not match the registered name: ${extension.name} !== ${name}`);
                    }
                    this._parent.onExtensionLoadedObservable.notifyObservers(extension);
                    return extension;
                })());
            }
        });
        this._extensions.push(...(await Promise.all(extensionPromises)));
        this._extensions.sort((a, b) => (a.order || Number.MAX_VALUE) - (b.order || Number.MAX_VALUE));
        this._parent.onExtensionLoadedObservable.clear();
        if (this._gltf.extensionsRequired) {
            for (const name of this._gltf.extensionsRequired) {
                const available = this._extensions.some((extension) => extension.name === name && extension.enabled);
                if (!available) {
                    if (this.parent.extensionOptions[name]?.enabled === false) {
                        throw new Error(`Required extension ${name} is disabled`);
                    }
                    throw new Error(`Required extension ${name} is not available`);
                }
            }
        }
    }
    _createRootNode() {
        if (this._parent.customRootNode !== undefined) {
            this._rootBabylonMesh = this._parent.customRootNode;
            return {
                // eslint-disable-next-line @typescript-eslint/naming-convention
                _babylonTransformNode: this._rootBabylonMesh === null ? undefined : this._rootBabylonMesh,
                index: -1,
            };
        }
        this._babylonScene._blockEntityCollection = !!this._assetContainer;
        const rootMesh = new Mesh("__root__", this._babylonScene);
        this._rootBabylonMesh = rootMesh;
        this._rootBabylonMesh._parentContainer = this._assetContainer;
        this._babylonScene._blockEntityCollection = false;
        this._rootBabylonMesh.setEnabled(false);
        const rootNode = {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            _babylonTransformNode: this._rootBabylonMesh,
            index: -1,
        };
        switch (this._parent.coordinateSystemMode) {
            case GLTFLoaderCoordinateSystemMode.AUTO: {
                if (!this._babylonScene.useRightHandedSystem) {
                    rootNode.rotation = [0, 1, 0, 0];
                    rootNode.scale = [1, 1, -1];
                    GLTFLoader._LoadTransform(rootNode, this._rootBabylonMesh);
                }
                break;
            }
            case GLTFLoaderCoordinateSystemMode.FORCE_RIGHT_HANDED: {
                this._babylonScene.useRightHandedSystem = true;
                break;
            }
            default: {
                throw new Error(`Invalid coordinate system mode (${this._parent.coordinateSystemMode})`);
            }
        }
        this._parent.onMeshLoadedObservable.notifyObservers(rootMesh);
        return rootNode;
    }
    /**
     * Loads a glTF scene.
     * @param context The context when loading the asset
     * @param scene The glTF scene property
     * @returns A promise that resolves when the load is complete
     */
    loadSceneAsync(context, scene) {
        const extensionPromise = this._extensionsLoadSceneAsync(context, scene);
        if (extensionPromise) {
            return extensionPromise;
        }
        const promises = new Array();
        this.logOpen(`${context} ${scene.name || ""}`);
        if (scene.nodes) {
            for (const index of scene.nodes) {
                const node = ArrayItem.Get(`${context}/nodes/${index}`, this._gltf.nodes, index);
                promises.push(this.loadNodeAsync(`/nodes/${node.index}`, node, (babylonMesh) => {
                    babylonMesh.parent = this._rootBabylonMesh;
                }));
            }
        }
        for (const action of this._postSceneLoadActions) {
            action();
        }
        promises.push(this._loadAnimationsAsync());
        this.logClose();
        return Promise.all(promises).then(() => { });
    }
    _forEachPrimitive(node, callback) {
        if (node._primitiveBabylonMeshes) {
            for (const babylonMesh of node._primitiveBabylonMeshes) {
                callback(babylonMesh);
            }
        }
    }
    _getGeometries() {
        const geometries = [];
        const nodes = this._gltf.nodes;
        if (nodes) {
            for (const node of nodes) {
                this._forEachPrimitive(node, (babylonMesh) => {
                    const geometry = babylonMesh.geometry;
                    if (geometry && geometries.indexOf(geometry) === -1) {
                        geometries.push(geometry);
                    }
                });
            }
        }
        return geometries;
    }
    _getMeshes() {
        const meshes = [];
        // Root mesh is always first, if available.
        if (this._rootBabylonMesh instanceof AbstractMesh) {
            meshes.push(this._rootBabylonMesh);
        }
        const nodes = this._gltf.nodes;
        if (nodes) {
            for (const node of nodes) {
                this._forEachPrimitive(node, (babylonMesh) => {
                    meshes.push(babylonMesh);
                });
            }
        }
        return meshes;
    }
    _getTransformNodes() {
        const transformNodes = [];
        const nodes = this._gltf.nodes;
        if (nodes) {
            for (const node of nodes) {
                if (node._babylonTransformNode && node._babylonTransformNode.getClassName() === "TransformNode") {
                    transformNodes.push(node._babylonTransformNode);
                }
                if (node._babylonTransformNodeForSkin) {
                    transformNodes.push(node._babylonTransformNodeForSkin);
                }
            }
        }
        return transformNodes;
    }
    _getSkeletons() {
        const skeletons = [];
        const skins = this._gltf.skins;
        if (skins) {
            for (const skin of skins) {
                if (skin._data) {
                    skeletons.push(skin._data.babylonSkeleton);
                }
            }
        }
        return skeletons;
    }
    _getAnimationGroups() {
        const animationGroups = [];
        const animations = this._gltf.animations;
        if (animations) {
            for (const animation of animations) {
                if (animation._babylonAnimationGroup) {
                    animationGroups.push(animation._babylonAnimationGroup);
                }
            }
        }
        return animationGroups;
    }
    _startAnimations() {
        switch (this._parent.animationStartMode) {
            case GLTFLoaderAnimationStartMode.NONE: {
                // do nothing
                break;
            }
            case GLTFLoaderAnimationStartMode.FIRST: {
                const babylonAnimationGroups = this._getAnimationGroups();
                if (babylonAnimationGroups.length !== 0) {
                    babylonAnimationGroups[0].start(true);
                }
                break;
            }
            case GLTFLoaderAnimationStartMode.ALL: {
                const babylonAnimationGroups = this._getAnimationGroups();
                for (const babylonAnimationGroup of babylonAnimationGroups) {
                    babylonAnimationGroup.start(true);
                }
                break;
            }
            default: {
                Logger.Error(`Invalid animation start mode (${this._parent.animationStartMode})`);
                return;
            }
        }
    }
    /**
     * Loads a glTF node.
     * @param context The context when loading the asset
     * @param node The glTF node property
     * @param assign A function called synchronously after parsing the glTF properties
     * @returns A promise that resolves with the loaded Babylon mesh when the load is complete
     */
    loadNodeAsync(context, node, assign = () => { }) {
        const extensionPromise = this._extensionsLoadNodeAsync(context, node, assign);
        if (extensionPromise) {
            return extensionPromise;
        }
        if (node._babylonTransformNode) {
            throw new Error(`${context}: Invalid recursive node hierarchy`);
        }
        const promises = new Array();
        this.logOpen(`${context} ${node.name || ""}`);
        const loadNode = (babylonTransformNode) => {
            GLTFLoader.AddPointerMetadata(babylonTransformNode, context);
            GLTFLoader._LoadTransform(node, babylonTransformNode);
            if (node.camera != undefined) {
                const camera = ArrayItem.Get(`${context}/camera`, this._gltf.cameras, node.camera);
                promises.push(this.loadCameraAsync(`/cameras/${camera.index}`, camera, (babylonCamera) => {
                    babylonCamera.parent = babylonTransformNode;
                }));
            }
            if (node.children) {
                for (const index of node.children) {
                    const childNode = ArrayItem.Get(`${context}/children/${index}`, this._gltf.nodes, index);
                    promises.push(this.loadNodeAsync(`/nodes/${childNode.index}`, childNode, (childBabylonMesh) => {
                        childBabylonMesh.parent = babylonTransformNode;
                    }));
                }
            }
            assign(babylonTransformNode);
        };
        const hasMesh = node.mesh != undefined;
        const hasSkin = this._parent.loadSkins && node.skin != undefined;
        if (!hasMesh || hasSkin) {
            const nodeName = node.name || `node${node.index}`;
            this._babylonScene._blockEntityCollection = !!this._assetContainer;
            const transformNode = new TransformNode(nodeName, this._babylonScene);
            transformNode._parentContainer = this._assetContainer;
            this._babylonScene._blockEntityCollection = false;
            if (node.mesh == undefined) {
                node._babylonTransformNode = transformNode;
            }
            else {
                node._babylonTransformNodeForSkin = transformNode;
            }
            loadNode(transformNode);
        }
        if (hasMesh) {
            if (hasSkin) {
                // See https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#skins (second implementation note)
                // This code path will place the skinned mesh as a sibling of the skeleton root node without loading the
                // transform, which effectively ignores the transform of the skinned mesh, as per spec.
                const mesh = ArrayItem.Get(`${context}/mesh`, this._gltf.meshes, node.mesh);
                promises.push(this._loadMeshAsync(`/meshes/${mesh.index}`, node, mesh, (babylonTransformNode) => {
                    const babylonTransformNodeForSkin = node._babylonTransformNodeForSkin;
                    // Merge the metadata from the skin node to the skinned mesh in case a loader extension added metadata.
                    babylonTransformNode.metadata = deepMerge(babylonTransformNodeForSkin.metadata, babylonTransformNode.metadata || {});
                    const skin = ArrayItem.Get(`${context}/skin`, this._gltf.skins, node.skin);
                    promises.push(this._loadSkinAsync(`/skins/${skin.index}`, node, skin, (babylonSkeleton) => {
                        this._forEachPrimitive(node, (babylonMesh) => {
                            babylonMesh.skeleton = babylonSkeleton;
                        });
                        // Wait until all the nodes are parented before parenting the skinned mesh.
                        this._postSceneLoadActions.push(() => {
                            if (skin.skeleton != undefined) {
                                // Place the skinned mesh node as a sibling of the skeleton root node.
                                // Handle special case when the parent of the skeleton root is the skinned mesh.
                                const parentNode = ArrayItem.Get(`/skins/${skin.index}/skeleton`, this._gltf.nodes, skin.skeleton).parent;
                                if (node.index === parentNode.index) {
                                    babylonTransformNode.parent = babylonTransformNodeForSkin.parent;
                                }
                                else {
                                    babylonTransformNode.parent = parentNode._babylonTransformNode;
                                }
                            }
                            else {
                                babylonTransformNode.parent = this._rootBabylonMesh;
                            }
                            this._parent.onSkinLoadedObservable.notifyObservers({ node: babylonTransformNodeForSkin, skinnedNode: babylonTransformNode });
                        });
                    }));
                }));
            }
            else {
                const mesh = ArrayItem.Get(`${context}/mesh`, this._gltf.meshes, node.mesh);
                promises.push(this._loadMeshAsync(`/meshes/${mesh.index}`, node, mesh, loadNode));
            }
        }
        this.logClose();
        return Promise.all(promises).then(() => {
            this._forEachPrimitive(node, (babylonMesh) => {
                if (babylonMesh.geometry && babylonMesh.geometry.useBoundingInfoFromGeometry) {
                    // simply apply the world matrices to the bounding info - the extends are already ok
                    babylonMesh._updateBoundingInfo();
                }
                else {
                    babylonMesh.refreshBoundingInfo(true, true);
                }
            });
            return node._babylonTransformNode;
        });
    }
    _loadMeshAsync(context, node, mesh, assign) {
        const primitives = mesh.primitives;
        if (!primitives || !primitives.length) {
            throw new Error(`${context}: Primitives are missing`);
        }
        if (primitives[0].index == undefined) {
            ArrayItem.Assign(primitives);
        }
        const promises = new Array();
        this.logOpen(`${context} ${mesh.name || ""}`);
        const name = node.name || `node${node.index}`;
        if (primitives.length === 1) {
            const primitive = mesh.primitives[0];
            promises.push(this._loadMeshPrimitiveAsync(`${context}/primitives/${primitive.index}`, name, node, mesh, primitive, (babylonMesh) => {
                node._babylonTransformNode = babylonMesh;
                node._primitiveBabylonMeshes = [babylonMesh];
            }));
        }
        else {
            this._babylonScene._blockEntityCollection = !!this._assetContainer;
            node._babylonTransformNode = new TransformNode(name, this._babylonScene);
            node._babylonTransformNode._parentContainer = this._assetContainer;
            this._babylonScene._blockEntityCollection = false;
            node._primitiveBabylonMeshes = [];
            for (const primitive of primitives) {
                promises.push(this._loadMeshPrimitiveAsync(`${context}/primitives/${primitive.index}`, `${name}_primitive${primitive.index}`, node, mesh, primitive, (babylonMesh) => {
                    babylonMesh.parent = node._babylonTransformNode;
                    node._primitiveBabylonMeshes.push(babylonMesh);
                }));
            }
        }
        assign(node._babylonTransformNode);
        this.logClose();
        return Promise.all(promises).then(() => {
            return node._babylonTransformNode;
        });
    }
    /**
     * @internal Define this method to modify the default behavior when loading data for mesh primitives.
     * @param context The context when loading the asset
     * @param name The mesh name when loading the asset
     * @param node The glTF node when loading the asset
     * @param mesh The glTF mesh when loading the asset
     * @param primitive The glTF mesh primitive property
     * @param assign A function called synchronously after parsing the glTF properties
     * @returns A promise that resolves with the loaded mesh when the load is complete or null if not handled
     */
    _loadMeshPrimitiveAsync(context, name, node, mesh, primitive, assign) {
        const extensionPromise = this._extensionsLoadMeshPrimitiveAsync(context, name, node, mesh, primitive, assign);
        if (extensionPromise) {
            return extensionPromise;
        }
        this.logOpen(`${context}`);
        const shouldInstance = this._disableInstancedMesh === 0 && this._parent.createInstances && node.skin == undefined && !mesh.primitives[0].targets;
        let babylonAbstractMesh;
        let promise;
        if (shouldInstance && primitive._instanceData) {
            this._babylonScene._blockEntityCollection = !!this._assetContainer;
            babylonAbstractMesh = primitive._instanceData.babylonSourceMesh.createInstance(name);
            babylonAbstractMesh._parentContainer = this._assetContainer;
            this._babylonScene._blockEntityCollection = false;
            promise = primitive._instanceData.promise;
        }
        else {
            const promises = new Array();
            this._babylonScene._blockEntityCollection = !!this._assetContainer;
            const babylonMesh = new Mesh(name, this._babylonScene);
            babylonMesh._parentContainer = this._assetContainer;
            this._babylonScene._blockEntityCollection = false;
            babylonMesh.sideOrientation = this._babylonScene.useRightHandedSystem ? Material.CounterClockWiseSideOrientation : Material.ClockWiseSideOrientation;
            this._createMorphTargets(context, node, mesh, primitive, babylonMesh);
            promises.push(this._loadVertexDataAsync(context, primitive, babylonMesh).then((babylonGeometry) => {
                return this._loadMorphTargetsAsync(context, primitive, babylonMesh, babylonGeometry).then(() => {
                    if (this._disposed) {
                        return;
                    }
                    this._babylonScene._blockEntityCollection = !!this._assetContainer;
                    babylonGeometry.applyToMesh(babylonMesh);
                    babylonGeometry._parentContainer = this._assetContainer;
                    this._babylonScene._blockEntityCollection = false;
                });
            }));
            const babylonDrawMode = GLTFLoader._GetDrawMode(context, primitive.mode);
            if (primitive.material == undefined) {
                let babylonMaterial = this._defaultBabylonMaterialData[babylonDrawMode];
                if (!babylonMaterial) {
                    babylonMaterial = this._createDefaultMaterial("__GLTFLoader._default", babylonDrawMode);
                    this._parent.onMaterialLoadedObservable.notifyObservers(babylonMaterial);
                    this._defaultBabylonMaterialData[babylonDrawMode] = babylonMaterial;
                }
                babylonMesh.material = babylonMaterial;
            }
            else if (!this.parent.skipMaterials) {
                const material = ArrayItem.Get(`${context}/material`, this._gltf.materials, primitive.material);
                promises.push(this._loadMaterialAsync(`/materials/${material.index}`, material, babylonMesh, babylonDrawMode, (babylonMaterial) => {
                    babylonMesh.material = babylonMaterial;
                }));
            }
            promise = Promise.all(promises);
            if (shouldInstance) {
                primitive._instanceData = {
                    babylonSourceMesh: babylonMesh,
                    promise: promise,
                };
            }
            babylonAbstractMesh = babylonMesh;
        }
        GLTFLoader.AddPointerMetadata(babylonAbstractMesh, context);
        this._parent.onMeshLoadedObservable.notifyObservers(babylonAbstractMesh);
        assign(babylonAbstractMesh);
        this.logClose();
        return promise.then(() => {
            return babylonAbstractMesh;
        });
    }
    _loadVertexDataAsync(context, primitive, babylonMesh) {
        const extensionPromise = this._extensionsLoadVertexDataAsync(context, primitive, babylonMesh);
        if (extensionPromise) {
            return extensionPromise;
        }
        const attributes = primitive.attributes;
        if (!attributes) {
            throw new Error(`${context}: Attributes are missing`);
        }
        const promises = new Array();
        const babylonGeometry = new Geometry(babylonMesh.name, this._babylonScene);
        if (primitive.indices == undefined) {
            babylonMesh.isUnIndexed = true;
        }
        else {
            const accessor = ArrayItem.Get(`${context}/indices`, this._gltf.accessors, primitive.indices);
            promises.push(this._loadIndicesAccessorAsync(`/accessors/${accessor.index}`, accessor).then((data) => {
                babylonGeometry.setIndices(data);
            }));
        }
        const loadAttribute = (name, kind, callback) => {
            if (attributes[name] == undefined) {
                return;
            }
            babylonMesh._delayInfo = babylonMesh._delayInfo || [];
            if (babylonMesh._delayInfo.indexOf(kind) === -1) {
                babylonMesh._delayInfo.push(kind);
            }
            const accessor = ArrayItem.Get(`${context}/attributes/${name}`, this._gltf.accessors, attributes[name]);
            promises.push(this._loadVertexAccessorAsync(`/accessors/${accessor.index}`, accessor, kind).then((babylonVertexBuffer) => {
                if (babylonVertexBuffer.getKind() === VertexBuffer.PositionKind && !this.parent.alwaysComputeBoundingBox && !babylonMesh.skeleton) {
                    const babylonBoundingInfo = LoadBoundingInfoFromPositionAccessor(accessor);
                    if (babylonBoundingInfo) {
                        babylonGeometry._boundingInfo = babylonBoundingInfo;
                        babylonGeometry.useBoundingInfoFromGeometry = true;
                    }
                }
                babylonGeometry.setVerticesBuffer(babylonVertexBuffer, accessor.count);
            }));
            if (kind == VertexBuffer.MatricesIndicesExtraKind) {
                babylonMesh.numBoneInfluencers = 8;
            }
            if (callback) {
                callback(accessor);
            }
        };
        loadAttribute("POSITION", VertexBuffer.PositionKind);
        loadAttribute("NORMAL", VertexBuffer.NormalKind);
        loadAttribute("TANGENT", VertexBuffer.TangentKind);
        loadAttribute("TEXCOORD_0", VertexBuffer.UVKind);
        loadAttribute("TEXCOORD_1", VertexBuffer.UV2Kind);
        loadAttribute("TEXCOORD_2", VertexBuffer.UV3Kind);
        loadAttribute("TEXCOORD_3", VertexBuffer.UV4Kind);
        loadAttribute("TEXCOORD_4", VertexBuffer.UV5Kind);
        loadAttribute("TEXCOORD_5", VertexBuffer.UV6Kind);
        loadAttribute("JOINTS_0", VertexBuffer.MatricesIndicesKind);
        loadAttribute("WEIGHTS_0", VertexBuffer.MatricesWeightsKind);
        loadAttribute("JOINTS_1", VertexBuffer.MatricesIndicesExtraKind);
        loadAttribute("WEIGHTS_1", VertexBuffer.MatricesWeightsExtraKind);
        loadAttribute("COLOR_0", VertexBuffer.ColorKind, (accessor) => {
            if (accessor.type === "VEC4" /* AccessorType.VEC4 */) {
                babylonMesh.hasVertexAlpha = true;
            }
        });
        return Promise.all(promises).then(() => {
            return babylonGeometry;
        });
    }
    _createMorphTargets(context, node, mesh, primitive, babylonMesh) {
        if (!primitive.targets || !this._parent.loadMorphTargets) {
            return;
        }
        if (node._numMorphTargets == undefined) {
            node._numMorphTargets = primitive.targets.length;
        }
        else if (primitive.targets.length !== node._numMorphTargets) {
            throw new Error(`${context}: Primitives do not have the same number of targets`);
        }
        const targetNames = mesh.extras ? mesh.extras.targetNames : null;
        this._babylonScene._blockEntityCollection = !!this._assetContainer;
        babylonMesh.morphTargetManager = new MorphTargetManager(this._babylonScene);
        babylonMesh.morphTargetManager._parentContainer = this._assetContainer;
        this._babylonScene._blockEntityCollection = false;
        babylonMesh.morphTargetManager.areUpdatesFrozen = true;
        for (let index = 0; index < primitive.targets.length; index++) {
            const weight = node.weights ? node.weights[index] : mesh.weights ? mesh.weights[index] : 0;
            const name = targetNames ? targetNames[index] : `morphTarget${index}`;
            babylonMesh.morphTargetManager.addTarget(new MorphTarget(name, weight, babylonMesh.getScene()));
            // TODO: tell the target whether it has positions, normals, tangents
        }
    }
    _loadMorphTargetsAsync(context, primitive, babylonMesh, babylonGeometry) {
        if (!primitive.targets || !this._parent.loadMorphTargets) {
            return Promise.resolve();
        }
        const promises = new Array();
        const morphTargetManager = babylonMesh.morphTargetManager;
        for (let index = 0; index < morphTargetManager.numTargets; index++) {
            const babylonMorphTarget = morphTargetManager.getTarget(index);
            promises.push(this._loadMorphTargetVertexDataAsync(`${context}/targets/${index}`, babylonGeometry, primitive.targets[index], babylonMorphTarget));
        }
        return Promise.all(promises).then(() => {
            morphTargetManager.areUpdatesFrozen = false;
        });
    }
    _loadMorphTargetVertexDataAsync(context, babylonGeometry, attributes, babylonMorphTarget) {
        const promises = new Array();
        const loadAttribute = (attribute, kind, setData) => {
            if (attributes[attribute] == undefined) {
                return;
            }
            const babylonVertexBuffer = babylonGeometry.getVertexBuffer(kind);
            if (!babylonVertexBuffer) {
                return;
            }
            const accessor = ArrayItem.Get(`${context}/${attribute}`, this._gltf.accessors, attributes[attribute]);
            promises.push(this._loadFloatAccessorAsync(`/accessors/${accessor.index}`, accessor).then((data) => {
                setData(babylonVertexBuffer, data);
            }));
        };
        loadAttribute("POSITION", VertexBuffer.PositionKind, (babylonVertexBuffer, data) => {
            const positions = new Float32Array(data.length);
            babylonVertexBuffer.forEach(data.length, (value, index) => {
                positions[index] = data[index] + value;
            });
            babylonMorphTarget.setPositions(positions);
        });
        loadAttribute("NORMAL", VertexBuffer.NormalKind, (babylonVertexBuffer, data) => {
            const normals = new Float32Array(data.length);
            babylonVertexBuffer.forEach(normals.length, (value, index) => {
                normals[index] = data[index] + value;
            });
            babylonMorphTarget.setNormals(normals);
        });
        loadAttribute("TANGENT", VertexBuffer.TangentKind, (babylonVertexBuffer, data) => {
            const tangents = new Float32Array((data.length / 3) * 4);
            let dataIndex = 0;
            babylonVertexBuffer.forEach((data.length / 3) * 4, (value, index) => {
                // Tangent data for morph targets is stored as xyz delta.
                // The vertexData.tangent is stored as xyzw.
                // So we need to skip every fourth vertexData.tangent.
                if ((index + 1) % 4 !== 0) {
                    tangents[dataIndex] = data[dataIndex] + value;
                    dataIndex++;
                }
            });
            babylonMorphTarget.setTangents(tangents);
        });
        loadAttribute("TEXCOORD_0", VertexBuffer.UVKind, (babylonVertexBuffer, data) => {
            const uvs = new Float32Array(data.length);
            babylonVertexBuffer.forEach(data.length, (value, index) => {
                uvs[index] = data[index] + value;
            });
            babylonMorphTarget.setUVs(uvs);
        });
        loadAttribute("TEXCOORD_1", VertexBuffer.UV2Kind, (babylonVertexBuffer, data) => {
            const uvs = new Float32Array(data.length);
            babylonVertexBuffer.forEach(data.length, (value, index) => {
                uvs[index] = data[index] + value;
            });
            babylonMorphTarget.setUV2s(uvs);
        });
        return Promise.all(promises).then(() => { });
    }
    static _LoadTransform(node, babylonNode) {
        // Ignore the TRS of skinned nodes.
        // See https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#skins (second implementation note)
        if (node.skin != undefined) {
            return;
        }
        let position = Vector3.Zero();
        let rotation = Quaternion.Identity();
        let scaling = Vector3.One();
        if (node.matrix) {
            const matrix = Matrix.FromArray(node.matrix);
            matrix.decompose(scaling, rotation, position);
        }
        else {
            if (node.translation) {
                position = Vector3.FromArray(node.translation);
            }
            if (node.rotation) {
                rotation = Quaternion.FromArray(node.rotation);
            }
            if (node.scale) {
                scaling = Vector3.FromArray(node.scale);
            }
        }
        babylonNode.position = position;
        babylonNode.rotationQuaternion = rotation;
        babylonNode.scaling = scaling;
    }
    _loadSkinAsync(context, node, skin, assign) {
        if (!this._parent.loadSkins) {
            return Promise.resolve();
        }
        const extensionPromise = this._extensionsLoadSkinAsync(context, node, skin);
        if (extensionPromise) {
            return extensionPromise;
        }
        if (skin._data) {
            assign(skin._data.babylonSkeleton);
            return skin._data.promise;
        }
        const skeletonId = `skeleton${skin.index}`;
        this._babylonScene._blockEntityCollection = !!this._assetContainer;
        const babylonSkeleton = new Skeleton(skin.name || skeletonId, skeletonId, this._babylonScene);
        babylonSkeleton._parentContainer = this._assetContainer;
        this._babylonScene._blockEntityCollection = false;
        this._loadBones(context, skin, babylonSkeleton);
        const promise = this._loadSkinInverseBindMatricesDataAsync(context, skin).then((inverseBindMatricesData) => {
            this._updateBoneMatrices(babylonSkeleton, inverseBindMatricesData);
        });
        skin._data = {
            babylonSkeleton: babylonSkeleton,
            promise: promise,
        };
        assign(babylonSkeleton);
        return promise;
    }
    _loadBones(context, skin, babylonSkeleton) {
        if (skin.skeleton == undefined || this._parent.alwaysComputeSkeletonRootNode) {
            const rootNode = this._findSkeletonRootNode(`${context}/joints`, skin.joints);
            if (rootNode) {
                if (skin.skeleton === undefined) {
                    skin.skeleton = rootNode.index;
                }
                else {
                    const isParent = (a, b) => {
                        for (; b.parent; b = b.parent) {
                            if (b.parent === a) {
                                return true;
                            }
                        }
                        return false;
                    };
                    const skeletonNode = ArrayItem.Get(`${context}/skeleton`, this._gltf.nodes, skin.skeleton);
                    if (skeletonNode !== rootNode && !isParent(skeletonNode, rootNode)) {
                        Logger.Warn(`${context}/skeleton: Overriding with nearest common ancestor as skeleton node is not a common root`);
                        skin.skeleton = rootNode.index;
                    }
                }
            }
            else {
                Logger.Warn(`${context}: Failed to find common root`);
            }
        }
        const babylonBones = {};
        for (const index of skin.joints) {
            const node = ArrayItem.Get(`${context}/joints/${index}`, this._gltf.nodes, index);
            this._loadBone(node, skin, babylonSkeleton, babylonBones);
        }
    }
    _findSkeletonRootNode(context, joints) {
        if (joints.length === 0) {
            return null;
        }
        const paths = {};
        for (const index of joints) {
            const path = [];
            let node = ArrayItem.Get(`${context}/${index}`, this._gltf.nodes, index);
            while (node.index !== -1) {
                path.unshift(node);
                node = node.parent;
            }
            paths[index] = path;
        }
        let rootNode = null;
        for (let i = 0;; ++i) {
            let path = paths[joints[0]];
            if (i >= path.length) {
                return rootNode;
            }
            const node = path[i];
            for (let j = 1; j < joints.length; ++j) {
                path = paths[joints[j]];
                if (i >= path.length || node !== path[i]) {
                    return rootNode;
                }
            }
            rootNode = node;
        }
    }
    _loadBone(node, skin, babylonSkeleton, babylonBones) {
        node._isJoint = true;
        let babylonBone = babylonBones[node.index];
        if (babylonBone) {
            return babylonBone;
        }
        let parentBabylonBone = null;
        if (node.index !== skin.skeleton) {
            if (node.parent && node.parent.index !== -1) {
                parentBabylonBone = this._loadBone(node.parent, skin, babylonSkeleton, babylonBones);
            }
            else if (skin.skeleton !== undefined) {
                Logger.Warn(`/skins/${skin.index}/skeleton: Skeleton node is not a common root`);
            }
        }
        const boneIndex = skin.joints.indexOf(node.index);
        babylonBone = new Bone(node.name || `joint${node.index}`, babylonSkeleton, parentBabylonBone, this._getNodeMatrix(node), null, null, boneIndex);
        babylonBones[node.index] = babylonBone;
        // Wait until the scene is loaded to ensure the transform nodes are loaded.
        this._postSceneLoadActions.push(() => {
            // Link the Babylon bone with the corresponding Babylon transform node.
            // A glTF joint is a pointer to a glTF node in the glTF node hierarchy similar to Unity3D.
            babylonBone.linkTransformNode(node._babylonTransformNode);
        });
        return babylonBone;
    }
    _loadSkinInverseBindMatricesDataAsync(context, skin) {
        if (skin.inverseBindMatrices == undefined) {
            return Promise.resolve(null);
        }
        const accessor = ArrayItem.Get(`${context}/inverseBindMatrices`, this._gltf.accessors, skin.inverseBindMatrices);
        return this._loadFloatAccessorAsync(`/accessors/${accessor.index}`, accessor);
    }
    _updateBoneMatrices(babylonSkeleton, inverseBindMatricesData) {
        for (const babylonBone of babylonSkeleton.bones) {
            const baseMatrix = Matrix.Identity();
            const boneIndex = babylonBone._index;
            if (inverseBindMatricesData && boneIndex !== -1) {
                Matrix.FromArrayToRef(inverseBindMatricesData, boneIndex * 16, baseMatrix);
                baseMatrix.invertToRef(baseMatrix);
            }
            const babylonParentBone = babylonBone.getParent();
            if (babylonParentBone) {
                baseMatrix.multiplyToRef(babylonParentBone.getAbsoluteInverseBindMatrix(), baseMatrix);
            }
            babylonBone.updateMatrix(baseMatrix, false, false);
            babylonBone._updateAbsoluteBindMatrices(undefined, false);
        }
    }
    _getNodeMatrix(node) {
        return node.matrix
            ? Matrix.FromArray(node.matrix)
            : Matrix.Compose(node.scale ? Vector3.FromArray(node.scale) : Vector3.One(), node.rotation ? Quaternion.FromArray(node.rotation) : Quaternion.Identity(), node.translation ? Vector3.FromArray(node.translation) : Vector3.Zero());
    }
    /**
     * Loads a glTF camera.
     * @param context The context when loading the asset
     * @param camera The glTF camera property
     * @param assign A function called synchronously after parsing the glTF properties
     * @returns A promise that resolves with the loaded Babylon camera when the load is complete
     */
    loadCameraAsync(context, camera, assign = () => { }) {
        const extensionPromise = this._extensionsLoadCameraAsync(context, camera, assign);
        if (extensionPromise) {
            return extensionPromise;
        }
        const promises = new Array();
        this.logOpen(`${context} ${camera.name || ""}`);
        this._babylonScene._blockEntityCollection = !!this._assetContainer;
        const babylonCamera = new FreeCamera(camera.name || `camera${camera.index}`, Vector3.Zero(), this._babylonScene, false);
        babylonCamera._parentContainer = this._assetContainer;
        this._babylonScene._blockEntityCollection = false;
        babylonCamera.ignoreParentScaling = true;
        camera._babylonCamera = babylonCamera;
        // Rotation by 180 as glTF has a different convention than Babylon.
        babylonCamera.rotation.set(0, Math.PI, 0);
        switch (camera.type) {
            case "perspective" /* CameraType.PERSPECTIVE */: {
                const perspective = camera.perspective;
                if (!perspective) {
                    throw new Error(`${context}: Camera perspective properties are missing`);
                }
                babylonCamera.fov = perspective.yfov;
                babylonCamera.minZ = perspective.znear;
                babylonCamera.maxZ = perspective.zfar || 0;
                break;
            }
            case "orthographic" /* CameraType.ORTHOGRAPHIC */: {
                if (!camera.orthographic) {
                    throw new Error(`${context}: Camera orthographic properties are missing`);
                }
                babylonCamera.mode = Camera.ORTHOGRAPHIC_CAMERA;
                babylonCamera.orthoLeft = -camera.orthographic.xmag;
                babylonCamera.orthoRight = camera.orthographic.xmag;
                babylonCamera.orthoBottom = -camera.orthographic.ymag;
                babylonCamera.orthoTop = camera.orthographic.ymag;
                babylonCamera.minZ = camera.orthographic.znear;
                babylonCamera.maxZ = camera.orthographic.zfar;
                break;
            }
            default: {
                throw new Error(`${context}: Invalid camera type (${camera.type})`);
            }
        }
        GLTFLoader.AddPointerMetadata(babylonCamera, context);
        this._parent.onCameraLoadedObservable.notifyObservers(babylonCamera);
        assign(babylonCamera);
        this.logClose();
        return Promise.all(promises).then(() => {
            return babylonCamera;
        });
    }
    _loadAnimationsAsync() {
        const animations = this._gltf.animations;
        if (!animations) {
            return Promise.resolve();
        }
        const promises = new Array();
        for (let index = 0; index < animations.length; index++) {
            const animation = animations[index];
            promises.push(this.loadAnimationAsync(`/animations/${animation.index}`, animation).then((animationGroup) => {
                // Delete the animation group if it ended up not having any animations in it.
                if (animationGroup.targetedAnimations.length === 0) {
                    animationGroup.dispose();
                }
            }));
        }
        return Promise.all(promises).then(() => { });
    }
    /**
     * Loads a glTF animation.
     * @param context The context when loading the asset
     * @param animation The glTF animation property
     * @returns A promise that resolves with the loaded Babylon animation group when the load is complete
     */
    loadAnimationAsync(context, animation) {
        const promise = this._extensionsLoadAnimationAsync(context, animation);
        if (promise) {
            return promise;
        }
        // eslint-disable-next-line @typescript-eslint/naming-convention
        return import('@babylonjs/core/Animations/animationGroup.js').then(({ AnimationGroup }) => {
            this._babylonScene._blockEntityCollection = !!this._assetContainer;
            const babylonAnimationGroup = new AnimationGroup(animation.name || `animation${animation.index}`, this._babylonScene);
            babylonAnimationGroup._parentContainer = this._assetContainer;
            this._babylonScene._blockEntityCollection = false;
            animation._babylonAnimationGroup = babylonAnimationGroup;
            const promises = new Array();
            ArrayItem.Assign(animation.channels);
            ArrayItem.Assign(animation.samplers);
            for (const channel of animation.channels) {
                promises.push(this._loadAnimationChannelAsync(`${context}/channels/${channel.index}`, context, animation, channel, (babylonTarget, babylonAnimation) => {
                    babylonTarget.animations = babylonTarget.animations || [];
                    babylonTarget.animations.push(babylonAnimation);
                    babylonAnimationGroup.addTargetedAnimation(babylonAnimation, babylonTarget);
                }));
            }
            return Promise.all(promises).then(() => {
                babylonAnimationGroup.normalize(0);
                return babylonAnimationGroup;
            });
        });
    }
    /**
     * @hidden
     * Loads a glTF animation channel.
     * @param context The context when loading the asset
     * @param animationContext The context of the animation when loading the asset
     * @param animation The glTF animation property
     * @param channel The glTF animation channel property
     * @param onLoad Called for each animation loaded
     * @returns A void promise that resolves when the load is complete
     */
    _loadAnimationChannelAsync(context, animationContext, animation, channel, onLoad) {
        const promise = this._extensionsLoadAnimationChannelAsync(context, animationContext, animation, channel, onLoad);
        if (promise) {
            return promise;
        }
        if (channel.target.node == undefined) {
            return Promise.resolve();
        }
        const targetNode = ArrayItem.Get(`${context}/target/node`, this._gltf.nodes, channel.target.node);
        const channelTargetPath = channel.target.path;
        const pathIsWeights = channelTargetPath === "weights" /* AnimationChannelTargetPath.WEIGHTS */;
        // Ignore animations that have no animation targets.
        if ((pathIsWeights && !targetNode._numMorphTargets) || (!pathIsWeights && !targetNode._babylonTransformNode)) {
            return Promise.resolve();
        }
        // Don't load node animations if disabled.
        if (!this._parent.loadNodeAnimations && !pathIsWeights && !targetNode._isJoint) {
            return Promise.resolve();
        }
        let properties;
        switch (channelTargetPath) {
            case "translation" /* AnimationChannelTargetPath.TRANSLATION */: {
                properties = nodeAnimationData.translation;
                break;
            }
            case "rotation" /* AnimationChannelTargetPath.ROTATION */: {
                properties = nodeAnimationData.rotation;
                break;
            }
            case "scale" /* AnimationChannelTargetPath.SCALE */: {
                properties = nodeAnimationData.scale;
                break;
            }
            case "weights" /* AnimationChannelTargetPath.WEIGHTS */: {
                properties = nodeAnimationData.weights;
                break;
            }
            default: {
                throw new Error(`${context}/target/path: Invalid value (${channel.target.path})`);
            }
        }
        const targetInfo = {
            object: targetNode,
            info: properties,
        };
        return this._loadAnimationChannelFromTargetInfoAsync(context, animationContext, animation, channel, targetInfo, onLoad);
    }
    /**
     * @hidden
     * Loads a glTF animation channel.
     * @param context The context when loading the asset
     * @param animationContext The context of the animation when loading the asset
     * @param animation The glTF animation property
     * @param channel The glTF animation channel property
     * @param targetInfo The glTF target and properties
     * @param onLoad Called for each animation loaded
     * @returns A void promise that resolves when the load is complete
     */
    _loadAnimationChannelFromTargetInfoAsync(context, animationContext, animation, channel, targetInfo, onLoad) {
        const fps = this.parent.targetFps;
        const invfps = 1 / fps;
        const sampler = ArrayItem.Get(`${context}/sampler`, animation.samplers, channel.sampler);
        return this._loadAnimationSamplerAsync(`${animationContext}/samplers/${channel.sampler}`, sampler).then((data) => {
            let numAnimations = 0;
            const target = targetInfo.object;
            const propertyInfos = targetInfo.info;
            // Extract the corresponding values from the read value.
            // GLTF values may be dispatched to several Babylon properties.
            // For example, baseColorFactor [`r`, `g`, `b`, `a`] is dispatched to
            // - albedoColor as Color3(`r`, `g`, `b`)
            // - alpha as `a`
            for (const propertyInfo of propertyInfos) {
                const stride = propertyInfo.getStride(target);
                const input = data.input;
                const output = data.output;
                const keys = new Array(input.length);
                let outputOffset = 0;
                switch (data.interpolation) {
                    case "STEP" /* AnimationSamplerInterpolation.STEP */: {
                        for (let index = 0; index < input.length; index++) {
                            const value = propertyInfo.getValue(target, output, outputOffset, 1);
                            outputOffset += stride;
                            keys[index] = {
                                frame: input[index] * fps,
                                value: value,
                                interpolation: 1 /* AnimationKeyInterpolation.STEP */,
                            };
                        }
                        break;
                    }
                    case "CUBICSPLINE" /* AnimationSamplerInterpolation.CUBICSPLINE */: {
                        for (let index = 0; index < input.length; index++) {
                            const inTangent = propertyInfo.getValue(target, output, outputOffset, invfps);
                            outputOffset += stride;
                            const value = propertyInfo.getValue(target, output, outputOffset, 1);
                            outputOffset += stride;
                            const outTangent = propertyInfo.getValue(target, output, outputOffset, invfps);
                            outputOffset += stride;
                            keys[index] = {
                                frame: input[index] * fps,
                                inTangent: inTangent,
                                value: value,
                                outTangent: outTangent,
                            };
                        }
                        break;
                    }
                    case "LINEAR" /* AnimationSamplerInterpolation.LINEAR */: {
                        for (let index = 0; index < input.length; index++) {
                            const value = propertyInfo.getValue(target, output, outputOffset, 1);
                            outputOffset += stride;
                            keys[index] = {
                                frame: input[index] * fps,
                                value: value,
                            };
                        }
                        break;
                    }
                }
                if (outputOffset > 0) {
                    const name = `${animation.name || `animation${animation.index}`}_channel${channel.index}_${numAnimations}`;
                    propertyInfo.buildAnimations(target, name, fps, keys, (babylonAnimatable, babylonAnimation) => {
                        ++numAnimations;
                        onLoad(babylonAnimatable, babylonAnimation);
                    });
                }
            }
        });
    }
    _loadAnimationSamplerAsync(context, sampler) {
        if (sampler._data) {
            return sampler._data;
        }
        const interpolation = sampler.interpolation || "LINEAR" /* AnimationSamplerInterpolation.LINEAR */;
        switch (interpolation) {
            case "STEP" /* AnimationSamplerInterpolation.STEP */:
            case "LINEAR" /* AnimationSamplerInterpolation.LINEAR */:
            case "CUBICSPLINE" /* AnimationSamplerInterpolation.CUBICSPLINE */: {
                break;
            }
            default: {
                throw new Error(`${context}/interpolation: Invalid value (${sampler.interpolation})`);
            }
        }
        const inputAccessor = ArrayItem.Get(`${context}/input`, this._gltf.accessors, sampler.input);
        const outputAccessor = ArrayItem.Get(`${context}/output`, this._gltf.accessors, sampler.output);
        sampler._data = Promise.all([
            this._loadFloatAccessorAsync(`/accessors/${inputAccessor.index}`, inputAccessor),
            this._loadFloatAccessorAsync(`/accessors/${outputAccessor.index}`, outputAccessor),
        ]).then(([inputData, outputData]) => {
            return {
                input: inputData,
                interpolation: interpolation,
                output: outputData,
            };
        });
        return sampler._data;
    }
    /**
     * Loads a glTF buffer.
     * @param context The context when loading the asset
     * @param buffer The glTF buffer property
     * @param byteOffset The byte offset to use
     * @param byteLength The byte length to use
     * @returns A promise that resolves with the loaded data when the load is complete
     */
    loadBufferAsync(context, buffer, byteOffset, byteLength) {
        const extensionPromise = this._extensionsLoadBufferAsync(context, buffer, byteOffset, byteLength);
        if (extensionPromise) {
            return extensionPromise;
        }
        if (!buffer._data) {
            if (buffer.uri) {
                buffer._data = this.loadUriAsync(`${context}/uri`, buffer, buffer.uri);
            }
            else {
                if (!this._bin) {
                    throw new Error(`${context}: Uri is missing or the binary glTF is missing its binary chunk`);
                }
                buffer._data = this._bin.readAsync(0, buffer.byteLength);
            }
        }
        return buffer._data.then((data) => {
            try {
                return new Uint8Array(data.buffer, data.byteOffset + byteOffset, byteLength);
            }
            catch (e) {
                throw new Error(`${context}: ${e.message}`);
            }
        });
    }
    /**
     * Loads a glTF buffer view.
     * @param context The context when loading the asset
     * @param bufferView The glTF buffer view property
     * @returns A promise that resolves with the loaded data when the load is complete
     */
    loadBufferViewAsync(context, bufferView) {
        const extensionPromise = this._extensionsLoadBufferViewAsync(context, bufferView);
        if (extensionPromise) {
            return extensionPromise;
        }
        if (bufferView._data) {
            return bufferView._data;
        }
        const buffer = ArrayItem.Get(`${context}/buffer`, this._gltf.buffers, bufferView.buffer);
        bufferView._data = this.loadBufferAsync(`/buffers/${buffer.index}`, buffer, bufferView.byteOffset || 0, bufferView.byteLength);
        return bufferView._data;
    }
    _loadAccessorAsync(context, accessor, constructor) {
        if (accessor._data) {
            return accessor._data;
        }
        const numComponents = GLTFLoader._GetNumComponents(context, accessor.type);
        const byteStride = numComponents * VertexBuffer.GetTypeByteLength(accessor.componentType);
        const length = numComponents * accessor.count;
        if (accessor.bufferView == undefined) {
            accessor._data = Promise.resolve(new constructor(length));
        }
        else {
            const bufferView = ArrayItem.Get(`${context}/bufferView`, this._gltf.bufferViews, accessor.bufferView);
            accessor._data = this.loadBufferViewAsync(`/bufferViews/${bufferView.index}`, bufferView).then((data) => {
                if (accessor.componentType === 5126 /* AccessorComponentType.FLOAT */ && !accessor.normalized && (!bufferView.byteStride || bufferView.byteStride === byteStride)) {
                    return GLTFLoader._GetTypedArray(context, accessor.componentType, data, accessor.byteOffset, length);
                }
                else {
                    const typedArray = new constructor(length);
                    VertexBuffer.ForEach(data, accessor.byteOffset || 0, bufferView.byteStride || byteStride, numComponents, accessor.componentType, typedArray.length, accessor.normalized || false, (value, index) => {
                        typedArray[index] = value;
                    });
                    return typedArray;
                }
            });
        }
        if (accessor.sparse) {
            const sparse = accessor.sparse;
            accessor._data = accessor._data.then((data) => {
                const typedArray = data;
                const indicesBufferView = ArrayItem.Get(`${context}/sparse/indices/bufferView`, this._gltf.bufferViews, sparse.indices.bufferView);
                const valuesBufferView = ArrayItem.Get(`${context}/sparse/values/bufferView`, this._gltf.bufferViews, sparse.values.bufferView);
                return Promise.all([
                    this.loadBufferViewAsync(`/bufferViews/${indicesBufferView.index}`, indicesBufferView),
                    this.loadBufferViewAsync(`/bufferViews/${valuesBufferView.index}`, valuesBufferView),
                ]).then(([indicesData, valuesData]) => {
                    const indices = GLTFLoader._GetTypedArray(`${context}/sparse/indices`, sparse.indices.componentType, indicesData, sparse.indices.byteOffset, sparse.count);
                    const sparseLength = numComponents * sparse.count;
                    let values;
                    if (accessor.componentType === 5126 /* AccessorComponentType.FLOAT */ && !accessor.normalized) {
                        values = GLTFLoader._GetTypedArray(`${context}/sparse/values`, accessor.componentType, valuesData, sparse.values.byteOffset, sparseLength);
                    }
                    else {
                        const sparseData = GLTFLoader._GetTypedArray(`${context}/sparse/values`, accessor.componentType, valuesData, sparse.values.byteOffset, sparseLength);
                        values = new constructor(sparseLength);
                        VertexBuffer.ForEach(sparseData, 0, byteStride, numComponents, accessor.componentType, values.length, accessor.normalized || false, (value, index) => {
                            values[index] = value;
                        });
                    }
                    let valuesIndex = 0;
                    for (let indicesIndex = 0; indicesIndex < indices.length; indicesIndex++) {
                        let dataIndex = indices[indicesIndex] * numComponents;
                        for (let componentIndex = 0; componentIndex < numComponents; componentIndex++) {
                            typedArray[dataIndex++] = values[valuesIndex++];
                        }
                    }
                    return typedArray;
                });
            });
        }
        return accessor._data;
    }
    /**
     * @internal
     */
    _loadFloatAccessorAsync(context, accessor) {
        return this._loadAccessorAsync(context, accessor, Float32Array);
    }
    /**
     * @internal
     */
    _loadIndicesAccessorAsync(context, accessor) {
        if (accessor.type !== "SCALAR" /* AccessorType.SCALAR */) {
            throw new Error(`${context}/type: Invalid value ${accessor.type}`);
        }
        if (accessor.componentType !== 5121 /* AccessorComponentType.UNSIGNED_BYTE */ &&
            accessor.componentType !== 5123 /* AccessorComponentType.UNSIGNED_SHORT */ &&
            accessor.componentType !== 5125 /* AccessorComponentType.UNSIGNED_INT */) {
            throw new Error(`${context}/componentType: Invalid value ${accessor.componentType}`);
        }
        if (accessor._data) {
            return accessor._data;
        }
        if (accessor.sparse) {
            const constructor = GLTFLoader._GetTypedArrayConstructor(`${context}/componentType`, accessor.componentType);
            accessor._data = this._loadAccessorAsync(context, accessor, constructor);
        }
        else {
            const bufferView = ArrayItem.Get(`${context}/bufferView`, this._gltf.bufferViews, accessor.bufferView);
            accessor._data = this.loadBufferViewAsync(`/bufferViews/${bufferView.index}`, bufferView).then((data) => {
                return GLTFLoader._GetTypedArray(context, accessor.componentType, data, accessor.byteOffset, accessor.count);
            });
        }
        return accessor._data;
    }
    /**
     * @internal
     */
    _loadVertexBufferViewAsync(bufferView) {
        if (bufferView._babylonBuffer) {
            return bufferView._babylonBuffer;
        }
        const engine = this._babylonScene.getEngine();
        bufferView._babylonBuffer = this.loadBufferViewAsync(`/bufferViews/${bufferView.index}`, bufferView).then((data) => {
            return new Buffer(engine, data, false);
        });
        return bufferView._babylonBuffer;
    }
    /**
     * @internal
     */
    _loadVertexAccessorAsync(context, accessor, kind) {
        if (accessor._babylonVertexBuffer?.[kind]) {
            return accessor._babylonVertexBuffer[kind];
        }
        if (!accessor._babylonVertexBuffer) {
            accessor._babylonVertexBuffer = {};
        }
        const engine = this._babylonScene.getEngine();
        if (accessor.sparse || accessor.bufferView == undefined) {
            accessor._babylonVertexBuffer[kind] = this._loadFloatAccessorAsync(context, accessor).then((data) => {
                return new VertexBuffer(engine, data, kind, false);
            });
        }
        else {
            const bufferView = ArrayItem.Get(`${context}/bufferView`, this._gltf.bufferViews, accessor.bufferView);
            accessor._babylonVertexBuffer[kind] = this._loadVertexBufferViewAsync(bufferView).then((babylonBuffer) => {
                const numComponents = GLTFLoader._GetNumComponents(context, accessor.type);
                return new VertexBuffer(engine, babylonBuffer, kind, false, undefined, bufferView.byteStride, undefined, accessor.byteOffset, numComponents, accessor.componentType, accessor.normalized, true, undefined, true);
            });
        }
        return accessor._babylonVertexBuffer[kind];
    }
    _loadMaterialMetallicRoughnessPropertiesAsync(context, properties, babylonMaterial) {
        if (!(babylonMaterial instanceof PBRMaterial)) {
            throw new Error(`${context}: Material type not supported`);
        }
        const promises = new Array();
        if (properties) {
            if (properties.baseColorFactor) {
                babylonMaterial.albedoColor = Color3.FromArray(properties.baseColorFactor);
                babylonMaterial.alpha = properties.baseColorFactor[3];
            }
            else {
                babylonMaterial.albedoColor = Color3.White();
            }
            babylonMaterial.metallic = properties.metallicFactor == undefined ? 1 : properties.metallicFactor;
            babylonMaterial.roughness = properties.roughnessFactor == undefined ? 1 : properties.roughnessFactor;
            if (properties.baseColorTexture) {
                promises.push(this.loadTextureInfoAsync(`${context}/baseColorTexture`, properties.baseColorTexture, (texture) => {
                    texture.name = `${babylonMaterial.name} (Base Color)`;
                    babylonMaterial.albedoTexture = texture;
                }));
            }
            if (properties.metallicRoughnessTexture) {
                properties.metallicRoughnessTexture.nonColorData = true;
                promises.push(this.loadTextureInfoAsync(`${context}/metallicRoughnessTexture`, properties.metallicRoughnessTexture, (texture) => {
                    texture.name = `${babylonMaterial.name} (Metallic Roughness)`;
                    babylonMaterial.metallicTexture = texture;
                }));
                babylonMaterial.useMetallnessFromMetallicTextureBlue = true;
                babylonMaterial.useRoughnessFromMetallicTextureGreen = true;
                babylonMaterial.useRoughnessFromMetallicTextureAlpha = false;
            }
        }
        return Promise.all(promises).then(() => { });
    }
    /**
     * @internal
     */
    _loadMaterialAsync(context, material, babylonMesh, babylonDrawMode, assign = () => { }) {
        const extensionPromise = this._extensionsLoadMaterialAsync(context, material, babylonMesh, babylonDrawMode, assign);
        if (extensionPromise) {
            return extensionPromise;
        }
        material._data = material._data || {};
        let babylonData = material._data[babylonDrawMode];
        if (!babylonData) {
            this.logOpen(`${context} ${material.name || ""}`);
            const babylonMaterial = this.createMaterial(context, material, babylonDrawMode);
            babylonData = {
                babylonMaterial: babylonMaterial,
                babylonMeshes: [],
                promise: this.loadMaterialPropertiesAsync(context, material, babylonMaterial),
            };
            material._data[babylonDrawMode] = babylonData;
            GLTFLoader.AddPointerMetadata(babylonMaterial, context);
            this._parent.onMaterialLoadedObservable.notifyObservers(babylonMaterial);
            this.logClose();
        }
        if (babylonMesh) {
            babylonData.babylonMeshes.push(babylonMesh);
            babylonMesh.onDisposeObservable.addOnce(() => {
                const index = babylonData.babylonMeshes.indexOf(babylonMesh);
                if (index !== -1) {
                    babylonData.babylonMeshes.splice(index, 1);
                }
            });
        }
        assign(babylonData.babylonMaterial);
        return babylonData.promise.then(() => {
            return babylonData.babylonMaterial;
        });
    }
    _createDefaultMaterial(name, babylonDrawMode) {
        this._babylonScene._blockEntityCollection = !!this._assetContainer;
        const babylonMaterial = new PBRMaterial(name, this._babylonScene);
        babylonMaterial._parentContainer = this._assetContainer;
        this._babylonScene._blockEntityCollection = false;
        // Moved to mesh so user can change materials on gltf meshes: babylonMaterial.sideOrientation = this._babylonScene.useRightHandedSystem ? Material.CounterClockWiseSideOrientation : Material.ClockWiseSideOrientation;
        babylonMaterial.fillMode = babylonDrawMode;
        babylonMaterial.enableSpecularAntiAliasing = true;
        babylonMaterial.useRadianceOverAlpha = !this._parent.transparencyAsCoverage;
        babylonMaterial.useSpecularOverAlpha = !this._parent.transparencyAsCoverage;
        babylonMaterial.transparencyMode = PBRMaterial.PBRMATERIAL_OPAQUE;
        babylonMaterial.metallic = 1;
        babylonMaterial.roughness = 1;
        return babylonMaterial;
    }
    /**
     * Creates a Babylon material from a glTF material.
     * @param context The context when loading the asset
     * @param material The glTF material property
     * @param babylonDrawMode The draw mode for the Babylon material
     * @returns The Babylon material
     */
    createMaterial(context, material, babylonDrawMode) {
        const extensionPromise = this._extensionsCreateMaterial(context, material, babylonDrawMode);
        if (extensionPromise) {
            return extensionPromise;
        }
        const name = material.name || `material${material.index}`;
        const babylonMaterial = this._createDefaultMaterial(name, babylonDrawMode);
        return babylonMaterial;
    }
    /**
     * Loads properties from a glTF material into a Babylon material.
     * @param context The context when loading the asset
     * @param material The glTF material property
     * @param babylonMaterial The Babylon material
     * @returns A promise that resolves when the load is complete
     */
    loadMaterialPropertiesAsync(context, material, babylonMaterial) {
        const extensionPromise = this._extensionsLoadMaterialPropertiesAsync(context, material, babylonMaterial);
        if (extensionPromise) {
            return extensionPromise;
        }
        const promises = new Array();
        promises.push(this.loadMaterialBasePropertiesAsync(context, material, babylonMaterial));
        if (material.pbrMetallicRoughness) {
            promises.push(this._loadMaterialMetallicRoughnessPropertiesAsync(`${context}/pbrMetallicRoughness`, material.pbrMetallicRoughness, babylonMaterial));
        }
        this.loadMaterialAlphaProperties(context, material, babylonMaterial);
        return Promise.all(promises).then(() => { });
    }
    /**
     * Loads the normal, occlusion, and emissive properties from a glTF material into a Babylon material.
     * @param context The context when loading the asset
     * @param material The glTF material property
     * @param babylonMaterial The Babylon material
     * @returns A promise that resolves when the load is complete
     */
    loadMaterialBasePropertiesAsync(context, material, babylonMaterial) {
        if (!(babylonMaterial instanceof PBRMaterial)) {
            throw new Error(`${context}: Material type not supported`);
        }
        const promises = new Array();
        babylonMaterial.emissiveColor = material.emissiveFactor ? Color3.FromArray(material.emissiveFactor) : new Color3(0, 0, 0);
        if (material.doubleSided) {
            babylonMaterial.backFaceCulling = false;
            babylonMaterial.twoSidedLighting = true;
        }
        if (material.normalTexture) {
            material.normalTexture.nonColorData = true;
            promises.push(this.loadTextureInfoAsync(`${context}/normalTexture`, material.normalTexture, (texture) => {
                texture.name = `${babylonMaterial.name} (Normal)`;
                babylonMaterial.bumpTexture = texture;
            }));
            babylonMaterial.invertNormalMapX = !this._babylonScene.useRightHandedSystem;
            babylonMaterial.invertNormalMapY = this._babylonScene.useRightHandedSystem;
            if (material.normalTexture.scale != undefined && babylonMaterial.bumpTexture) {
                babylonMaterial.bumpTexture.level = material.normalTexture.scale;
            }
            babylonMaterial.forceIrradianceInFragment = true;
        }
        if (material.occlusionTexture) {
            material.occlusionTexture.nonColorData = true;
            promises.push(this.loadTextureInfoAsync(`${context}/occlusionTexture`, material.occlusionTexture, (texture) => {
                texture.name = `${babylonMaterial.name} (Occlusion)`;
                babylonMaterial.ambientTexture = texture;
            }));
            babylonMaterial.useAmbientInGrayScale = true;
            if (material.occlusionTexture.strength != undefined) {
                babylonMaterial.ambientTextureStrength = material.occlusionTexture.strength;
            }
        }
        if (material.emissiveTexture) {
            promises.push(this.loadTextureInfoAsync(`${context}/emissiveTexture`, material.emissiveTexture, (texture) => {
                texture.name = `${babylonMaterial.name} (Emissive)`;
                babylonMaterial.emissiveTexture = texture;
            }));
        }
        return Promise.all(promises).then(() => { });
    }
    /**
     * Loads the alpha properties from a glTF material into a Babylon material.
     * Must be called after the setting the albedo texture of the Babylon material when the material has an albedo texture.
     * @param context The context when loading the asset
     * @param material The glTF material property
     * @param babylonMaterial The Babylon material
     */
    loadMaterialAlphaProperties(context, material, babylonMaterial) {
        if (!(babylonMaterial instanceof PBRMaterial)) {
            throw new Error(`${context}: Material type not supported`);
        }
        const alphaMode = material.alphaMode || "OPAQUE" /* MaterialAlphaMode.OPAQUE */;
        switch (alphaMode) {
            case "OPAQUE" /* MaterialAlphaMode.OPAQUE */: {
                babylonMaterial.transparencyMode = PBRMaterial.PBRMATERIAL_OPAQUE;
                babylonMaterial.alpha = 1.0; // Force alpha to 1.0 for opaque mode.
                break;
            }
            case "MASK" /* MaterialAlphaMode.MASK */: {
                babylonMaterial.transparencyMode = PBRMaterial.PBRMATERIAL_ALPHATEST;
                babylonMaterial.alphaCutOff = material.alphaCutoff == undefined ? 0.5 : material.alphaCutoff;
                if (babylonMaterial.albedoTexture) {
                    babylonMaterial.albedoTexture.hasAlpha = true;
                }
                break;
            }
            case "BLEND" /* MaterialAlphaMode.BLEND */: {
                babylonMaterial.transparencyMode = PBRMaterial.PBRMATERIAL_ALPHABLEND;
                if (babylonMaterial.albedoTexture) {
                    babylonMaterial.albedoTexture.hasAlpha = true;
                    babylonMaterial.useAlphaFromAlbedoTexture = true;
                }
                break;
            }
            default: {
                throw new Error(`${context}/alphaMode: Invalid value (${material.alphaMode})`);
            }
        }
    }
    /**
     * Loads a glTF texture info.
     * @param context The context when loading the asset
     * @param textureInfo The glTF texture info property
     * @param assign A function called synchronously after parsing the glTF properties
     * @returns A promise that resolves with the loaded Babylon texture when the load is complete
     */
    loadTextureInfoAsync(context, textureInfo, assign = () => { }) {
        const extensionPromise = this._extensionsLoadTextureInfoAsync(context, textureInfo, assign);
        if (extensionPromise) {
            return extensionPromise;
        }
        this.logOpen(`${context}`);
        if (textureInfo.texCoord >= 6) {
            throw new Error(`${context}/texCoord: Invalid value (${textureInfo.texCoord})`);
        }
        const texture = ArrayItem.Get(`${context}/index`, this._gltf.textures, textureInfo.index);
        texture._textureInfo = textureInfo;
        const promise = this._loadTextureAsync(`/textures/${textureInfo.index}`, texture, (babylonTexture) => {
            babylonTexture.coordinatesIndex = textureInfo.texCoord || 0;
            GLTFLoader.AddPointerMetadata(babylonTexture, context);
            this._parent.onTextureLoadedObservable.notifyObservers(babylonTexture);
            assign(babylonTexture);
        });
        this.logClose();
        return promise;
    }
    /**
     * @internal
     */
    _loadTextureAsync(context, texture, assign = () => { }) {
        const extensionPromise = this._extensionsLoadTextureAsync(context, texture, assign);
        if (extensionPromise) {
            return extensionPromise;
        }
        this.logOpen(`${context} ${texture.name || ""}`);
        const sampler = texture.sampler == undefined ? GLTFLoader.DefaultSampler : ArrayItem.Get(`${context}/sampler`, this._gltf.samplers, texture.sampler);
        const image = ArrayItem.Get(`${context}/source`, this._gltf.images, texture.source);
        const promise = this._createTextureAsync(context, sampler, image, assign, undefined, !texture._textureInfo.nonColorData);
        this.logClose();
        return promise;
    }
    /**
     * @internal
     */
    _createTextureAsync(context, sampler, image, assign = () => { }, textureLoaderOptions, useSRGBBuffer) {
        const samplerData = this._loadSampler(`/samplers/${sampler.index}`, sampler);
        const promises = new Array();
        const deferred = new Deferred();
        this._babylonScene._blockEntityCollection = !!this._assetContainer;
        const textureCreationOptions = {
            noMipmap: samplerData.noMipMaps,
            invertY: false,
            samplingMode: samplerData.samplingMode,
            onLoad: () => {
                if (!this._disposed) {
                    deferred.resolve();
                }
            },
            onError: (message, exception) => {
                if (!this._disposed) {
                    deferred.reject(new Error(`${context}: ${exception && exception.message ? exception.message : message || "Failed to load texture"}`));
                }
            },
            mimeType: image.mimeType,
            loaderOptions: textureLoaderOptions,
            useSRGBBuffer: !!useSRGBBuffer && this._parent.useSRGBBuffers,
        };
        const babylonTexture = new Texture(null, this._babylonScene, textureCreationOptions);
        babylonTexture._parentContainer = this._assetContainer;
        this._babylonScene._blockEntityCollection = false;
        promises.push(deferred.promise);
        promises.push(this.loadImageAsync(`/images/${image.index}`, image).then((data) => {
            const name = image.uri || `${this._fileName}#image${image.index}`;
            const dataUrl = `data:${this._uniqueRootUrl}${name}`;
            babylonTexture.updateURL(dataUrl, data);
            // Set the internal texture label.
            const internalTexture = babylonTexture.getInternalTexture();
            if (internalTexture) {
                internalTexture.label = image.name;
            }
        }));
        babylonTexture.wrapU = samplerData.wrapU;
        babylonTexture.wrapV = samplerData.wrapV;
        assign(babylonTexture);
        if (this._parent.useGltfTextureNames) {
            babylonTexture.name = image.name || image.uri || `image${image.index}`;
        }
        return Promise.all(promises).then(() => {
            return babylonTexture;
        });
    }
    _loadSampler(context, sampler) {
        if (!sampler._data) {
            sampler._data = {
                noMipMaps: sampler.minFilter === 9728 /* TextureMinFilter.NEAREST */ || sampler.minFilter === 9729 /* TextureMinFilter.LINEAR */,
                samplingMode: GLTFLoader._GetTextureSamplingMode(context, sampler),
                wrapU: GLTFLoader._GetTextureWrapMode(`${context}/wrapS`, sampler.wrapS),
                wrapV: GLTFLoader._GetTextureWrapMode(`${context}/wrapT`, sampler.wrapT),
            };
        }
        return sampler._data;
    }
    /**
     * Loads a glTF image.
     * @param context The context when loading the asset
     * @param image The glTF image property
     * @returns A promise that resolves with the loaded data when the load is complete
     */
    loadImageAsync(context, image) {
        if (!image._data) {
            this.logOpen(`${context} ${image.name || ""}`);
            if (image.uri) {
                image._data = this.loadUriAsync(`${context}/uri`, image, image.uri);
            }
            else {
                const bufferView = ArrayItem.Get(`${context}/bufferView`, this._gltf.bufferViews, image.bufferView);
                image._data = this.loadBufferViewAsync(`/bufferViews/${bufferView.index}`, bufferView);
            }
            this.logClose();
        }
        return image._data;
    }
    /**
     * Loads a glTF uri.
     * @param context The context when loading the asset
     * @param property The glTF property associated with the uri
     * @param uri The base64 or relative uri
     * @returns A promise that resolves with the loaded data when the load is complete
     */
    loadUriAsync(context, property, uri) {
        const extensionPromise = this._extensionsLoadUriAsync(context, property, uri);
        if (extensionPromise) {
            return extensionPromise;
        }
        if (!GLTFLoader._ValidateUri(uri)) {
            throw new Error(`${context}: '${uri}' is invalid`);
        }
        if (IsBase64DataUrl(uri)) {
            const data = new Uint8Array(DecodeBase64UrlToBinary(uri));
            this.log(`${context}: Decoded ${uri.substring(0, 64)}... (${data.length} bytes)`);
            return Promise.resolve(data);
        }
        this.log(`${context}: Loading ${uri}`);
        return this._parent.preprocessUrlAsync(this._rootUrl + uri).then((url) => {
            return new Promise((resolve, reject) => {
                this._parent._loadFile(this._babylonScene, url, (data) => {
                    if (!this._disposed) {
                        this.log(`${context}: Loaded ${uri} (${data.byteLength} bytes)`);
                        resolve(new Uint8Array(data));
                    }
                }, true, (request) => {
                    reject(new LoadFileError(`${context}: Failed to load '${uri}'${request ? ": " + request.status + " " + request.statusText : ""}`, request));
                });
            });
        });
    }
    /**
     * Adds a JSON pointer to the _internalMetadata of the Babylon object at `<object>._internalMetadata.gltf.pointers`.
     * @param babylonObject the Babylon object with _internalMetadata
     * @param pointer the JSON pointer
     */
    static AddPointerMetadata(babylonObject, pointer) {
        babylonObject.metadata = babylonObject.metadata || {};
        const metadata = (babylonObject._internalMetadata = babylonObject._internalMetadata || {});
        const gltf = (metadata.gltf = metadata.gltf || {});
        const pointers = (gltf.pointers = gltf.pointers || []);
        pointers.push(pointer);
    }
    static _GetTextureWrapMode(context, mode) {
        // Set defaults if undefined
        mode = mode == undefined ? 10497 /* TextureWrapMode.REPEAT */ : mode;
        switch (mode) {
            case 33071 /* TextureWrapMode.CLAMP_TO_EDGE */:
                return Texture.CLAMP_ADDRESSMODE;
            case 33648 /* TextureWrapMode.MIRRORED_REPEAT */:
                return Texture.MIRROR_ADDRESSMODE;
            case 10497 /* TextureWrapMode.REPEAT */:
                return Texture.WRAP_ADDRESSMODE;
            default:
                Logger.Warn(`${context}: Invalid value (${mode})`);
                return Texture.WRAP_ADDRESSMODE;
        }
    }
    static _GetTextureSamplingMode(context, sampler) {
        // Set defaults if undefined
        const magFilter = sampler.magFilter == undefined ? 9729 /* TextureMagFilter.LINEAR */ : sampler.magFilter;
        const minFilter = sampler.minFilter == undefined ? 9987 /* TextureMinFilter.LINEAR_MIPMAP_LINEAR */ : sampler.minFilter;
        if (magFilter === 9729 /* TextureMagFilter.LINEAR */) {
            switch (minFilter) {
                case 9728 /* TextureMinFilter.NEAREST */:
                    return Texture.LINEAR_NEAREST;
                case 9729 /* TextureMinFilter.LINEAR */:
                    return Texture.LINEAR_LINEAR;
                case 9984 /* TextureMinFilter.NEAREST_MIPMAP_NEAREST */:
                    return Texture.LINEAR_NEAREST_MIPNEAREST;
                case 9985 /* TextureMinFilter.LINEAR_MIPMAP_NEAREST */:
                    return Texture.LINEAR_LINEAR_MIPNEAREST;
                case 9986 /* TextureMinFilter.NEAREST_MIPMAP_LINEAR */:
                    return Texture.LINEAR_NEAREST_MIPLINEAR;
                case 9987 /* TextureMinFilter.LINEAR_MIPMAP_LINEAR */:
                    return Texture.LINEAR_LINEAR_MIPLINEAR;
                default:
                    Logger.Warn(`${context}/minFilter: Invalid value (${minFilter})`);
                    return Texture.LINEAR_LINEAR_MIPLINEAR;
            }
        }
        else {
            if (magFilter !== 9728 /* TextureMagFilter.NEAREST */) {
                Logger.Warn(`${context}/magFilter: Invalid value (${magFilter})`);
            }
            switch (minFilter) {
                case 9728 /* TextureMinFilter.NEAREST */:
                    return Texture.NEAREST_NEAREST;
                case 9729 /* TextureMinFilter.LINEAR */:
                    return Texture.NEAREST_LINEAR;
                case 9984 /* TextureMinFilter.NEAREST_MIPMAP_NEAREST */:
                    return Texture.NEAREST_NEAREST_MIPNEAREST;
                case 9985 /* TextureMinFilter.LINEAR_MIPMAP_NEAREST */:
                    return Texture.NEAREST_LINEAR_MIPNEAREST;
                case 9986 /* TextureMinFilter.NEAREST_MIPMAP_LINEAR */:
                    return Texture.NEAREST_NEAREST_MIPLINEAR;
                case 9987 /* TextureMinFilter.LINEAR_MIPMAP_LINEAR */:
                    return Texture.NEAREST_LINEAR_MIPLINEAR;
                default:
                    Logger.Warn(`${context}/minFilter: Invalid value (${minFilter})`);
                    return Texture.NEAREST_NEAREST_MIPNEAREST;
            }
        }
    }
    static _GetTypedArrayConstructor(context, componentType) {
        switch (componentType) {
            case 5120 /* AccessorComponentType.BYTE */:
                return Int8Array;
            case 5121 /* AccessorComponentType.UNSIGNED_BYTE */:
                return Uint8Array;
            case 5122 /* AccessorComponentType.SHORT */:
                return Int16Array;
            case 5123 /* AccessorComponentType.UNSIGNED_SHORT */:
                return Uint16Array;
            case 5125 /* AccessorComponentType.UNSIGNED_INT */:
                return Uint32Array;
            case 5126 /* AccessorComponentType.FLOAT */:
                return Float32Array;
            default:
                throw new Error(`${context}: Invalid component type ${componentType}`);
        }
    }
    static _GetTypedArray(context, componentType, bufferView, byteOffset, length) {
        const buffer = bufferView.buffer;
        byteOffset = bufferView.byteOffset + (byteOffset || 0);
        const constructor = GLTFLoader._GetTypedArrayConstructor(`${context}/componentType`, componentType);
        const componentTypeLength = VertexBuffer.GetTypeByteLength(componentType);
        if (byteOffset % componentTypeLength !== 0) {
            // HACK: Copy the buffer if byte offset is not a multiple of component type byte length.
            Logger.Warn(`${context}: Copying buffer as byte offset (${byteOffset}) is not a multiple of component type byte length (${componentTypeLength})`);
            return new constructor(buffer.slice(byteOffset, byteOffset + length * componentTypeLength), 0);
        }
        return new constructor(buffer, byteOffset, length);
    }
    static _GetNumComponents(context, type) {
        switch (type) {
            case "SCALAR":
                return 1;
            case "VEC2":
                return 2;
            case "VEC3":
                return 3;
            case "VEC4":
                return 4;
            case "MAT2":
                return 4;
            case "MAT3":
                return 9;
            case "MAT4":
                return 16;
        }
        throw new Error(`${context}: Invalid type (${type})`);
    }
    static _ValidateUri(uri) {
        return Tools.IsBase64(uri) || uri.indexOf("..") === -1;
    }
    /**
     * @internal
     */
    static _GetDrawMode(context, mode) {
        if (mode == undefined) {
            mode = 4 /* MeshPrimitiveMode.TRIANGLES */;
        }
        switch (mode) {
            case 0 /* MeshPrimitiveMode.POINTS */:
                return Material.PointListDrawMode;
            case 1 /* MeshPrimitiveMode.LINES */:
                return Material.LineListDrawMode;
            case 2 /* MeshPrimitiveMode.LINE_LOOP */:
                return Material.LineLoopDrawMode;
            case 3 /* MeshPrimitiveMode.LINE_STRIP */:
                return Material.LineStripDrawMode;
            case 4 /* MeshPrimitiveMode.TRIANGLES */:
                return Material.TriangleFillMode;
            case 5 /* MeshPrimitiveMode.TRIANGLE_STRIP */:
                return Material.TriangleStripDrawMode;
            case 6 /* MeshPrimitiveMode.TRIANGLE_FAN */:
                return Material.TriangleFanDrawMode;
        }
        throw new Error(`${context}: Invalid mesh primitive mode (${mode})`);
    }
    _compileMaterialsAsync() {
        this._parent._startPerformanceCounter("Compile materials");
        const promises = new Array();
        if (this._gltf.materials) {
            for (const material of this._gltf.materials) {
                if (material._data) {
                    for (const babylonDrawMode in material._data) {
                        const babylonData = material._data[babylonDrawMode];
                        for (const babylonMesh of babylonData.babylonMeshes) {
                            // Ensure nonUniformScaling is set if necessary.
                            babylonMesh.computeWorldMatrix(true);
                            const babylonMaterial = babylonData.babylonMaterial;
                            promises.push(babylonMaterial.forceCompilationAsync(babylonMesh));
                            promises.push(babylonMaterial.forceCompilationAsync(babylonMesh, { useInstances: true }));
                            if (this._parent.useClipPlane) {
                                promises.push(babylonMaterial.forceCompilationAsync(babylonMesh, { clipPlane: true }));
                                promises.push(babylonMaterial.forceCompilationAsync(babylonMesh, { clipPlane: true, useInstances: true }));
                            }
                        }
                    }
                }
            }
        }
        return Promise.all(promises).then(() => {
            this._parent._endPerformanceCounter("Compile materials");
        });
    }
    _compileShadowGeneratorsAsync() {
        this._parent._startPerformanceCounter("Compile shadow generators");
        const promises = new Array();
        const lights = this._babylonScene.lights;
        for (const light of lights) {
            const generator = light.getShadowGenerator();
            if (generator) {
                promises.push(generator.forceCompilationAsync());
            }
        }
        return Promise.all(promises).then(() => {
            this._parent._endPerformanceCounter("Compile shadow generators");
        });
    }
    _forEachExtensions(action) {
        for (const extension of this._extensions) {
            if (extension.enabled) {
                action(extension);
            }
        }
    }
    _applyExtensions(property, functionName, actionAsync) {
        for (const extension of this._extensions) {
            if (extension.enabled) {
                const id = `${extension.name}.${functionName}`;
                const loaderProperty = property;
                loaderProperty._activeLoaderExtensionFunctions = loaderProperty._activeLoaderExtensionFunctions || {};
                const activeLoaderExtensionFunctions = loaderProperty._activeLoaderExtensionFunctions;
                if (!activeLoaderExtensionFunctions[id]) {
                    activeLoaderExtensionFunctions[id] = true;
                    try {
                        const result = actionAsync(extension);
                        if (result) {
                            return result;
                        }
                    }
                    finally {
                        delete activeLoaderExtensionFunctions[id];
                    }
                }
            }
        }
        return null;
    }
    _extensionsOnLoading() {
        this._forEachExtensions((extension) => extension.onLoading && extension.onLoading());
    }
    _extensionsOnReady() {
        this._forEachExtensions((extension) => extension.onReady && extension.onReady());
    }
    _extensionsLoadSceneAsync(context, scene) {
        return this._applyExtensions(scene, "loadScene", (extension) => extension.loadSceneAsync && extension.loadSceneAsync(context, scene));
    }
    _extensionsLoadNodeAsync(context, node, assign) {
        return this._applyExtensions(node, "loadNode", (extension) => extension.loadNodeAsync && extension.loadNodeAsync(context, node, assign));
    }
    _extensionsLoadCameraAsync(context, camera, assign) {
        return this._applyExtensions(camera, "loadCamera", (extension) => extension.loadCameraAsync && extension.loadCameraAsync(context, camera, assign));
    }
    _extensionsLoadVertexDataAsync(context, primitive, babylonMesh) {
        return this._applyExtensions(primitive, "loadVertexData", (extension) => extension._loadVertexDataAsync && extension._loadVertexDataAsync(context, primitive, babylonMesh));
    }
    _extensionsLoadMeshPrimitiveAsync(context, name, node, mesh, primitive, assign) {
        return this._applyExtensions(primitive, "loadMeshPrimitive", (extension) => extension._loadMeshPrimitiveAsync && extension._loadMeshPrimitiveAsync(context, name, node, mesh, primitive, assign));
    }
    _extensionsLoadMaterialAsync(context, material, babylonMesh, babylonDrawMode, assign) {
        return this._applyExtensions(material, "loadMaterial", (extension) => extension._loadMaterialAsync && extension._loadMaterialAsync(context, material, babylonMesh, babylonDrawMode, assign));
    }
    _extensionsCreateMaterial(context, material, babylonDrawMode) {
        return this._applyExtensions(material, "createMaterial", (extension) => extension.createMaterial && extension.createMaterial(context, material, babylonDrawMode));
    }
    _extensionsLoadMaterialPropertiesAsync(context, material, babylonMaterial) {
        return this._applyExtensions(material, "loadMaterialProperties", (extension) => extension.loadMaterialPropertiesAsync && extension.loadMaterialPropertiesAsync(context, material, babylonMaterial));
    }
    _extensionsLoadTextureInfoAsync(context, textureInfo, assign) {
        return this._applyExtensions(textureInfo, "loadTextureInfo", (extension) => extension.loadTextureInfoAsync && extension.loadTextureInfoAsync(context, textureInfo, assign));
    }
    _extensionsLoadTextureAsync(context, texture, assign) {
        return this._applyExtensions(texture, "loadTexture", (extension) => extension._loadTextureAsync && extension._loadTextureAsync(context, texture, assign));
    }
    _extensionsLoadAnimationAsync(context, animation) {
        return this._applyExtensions(animation, "loadAnimation", (extension) => extension.loadAnimationAsync && extension.loadAnimationAsync(context, animation));
    }
    _extensionsLoadAnimationChannelAsync(context, animationContext, animation, channel, onLoad) {
        return this._applyExtensions(animation, "loadAnimationChannel", (extension) => extension._loadAnimationChannelAsync && extension._loadAnimationChannelAsync(context, animationContext, animation, channel, onLoad));
    }
    _extensionsLoadSkinAsync(context, node, skin) {
        return this._applyExtensions(skin, "loadSkin", (extension) => extension._loadSkinAsync && extension._loadSkinAsync(context, node, skin));
    }
    _extensionsLoadUriAsync(context, property, uri) {
        return this._applyExtensions(property, "loadUri", (extension) => extension._loadUriAsync && extension._loadUriAsync(context, property, uri));
    }
    _extensionsLoadBufferViewAsync(context, bufferView) {
        return this._applyExtensions(bufferView, "loadBufferView", (extension) => extension.loadBufferViewAsync && extension.loadBufferViewAsync(context, bufferView));
    }
    _extensionsLoadBufferAsync(context, buffer, byteOffset, byteLength) {
        return this._applyExtensions(buffer, "loadBuffer", (extension) => extension.loadBufferAsync && extension.loadBufferAsync(context, buffer, byteOffset, byteLength));
    }
    /**
     * Helper method called by a loader extension to load an glTF extension.
     * @param context The context when loading the asset
     * @param property The glTF property to load the extension from
     * @param extensionName The name of the extension to load
     * @param actionAsync The action to run
     * @returns The promise returned by actionAsync or null if the extension does not exist
     */
    static LoadExtensionAsync(context, property, extensionName, actionAsync) {
        if (!property.extensions) {
            return null;
        }
        const extensions = property.extensions;
        const extension = extensions[extensionName];
        if (!extension) {
            return null;
        }
        return actionAsync(`${context}/extensions/${extensionName}`, extension);
    }
    /**
     * Helper method called by a loader extension to load a glTF extra.
     * @param context The context when loading the asset
     * @param property The glTF property to load the extra from
     * @param extensionName The name of the extension to load
     * @param actionAsync The action to run
     * @returns The promise returned by actionAsync or null if the extra does not exist
     */
    static LoadExtraAsync(context, property, extensionName, actionAsync) {
        if (!property.extras) {
            return null;
        }
        const extras = property.extras;
        const extra = extras[extensionName];
        if (!extra) {
            return null;
        }
        return actionAsync(`${context}/extras/${extensionName}`, extra);
    }
    /**
     * Checks for presence of an extension.
     * @param name The name of the extension to check
     * @returns A boolean indicating the presence of the given extension name in `extensionsUsed`
     */
    isExtensionUsed(name) {
        return !!this._gltf.extensionsUsed && this._gltf.extensionsUsed.indexOf(name) !== -1;
    }
    /**
     * Increments the indentation level and logs a message.
     * @param message The message to log
     */
    logOpen(message) {
        this._parent._logOpen(message);
    }
    /**
     * Decrements the indentation level.
     */
    logClose() {
        this._parent._logClose();
    }
    /**
     * Logs a message
     * @param message The message to log
     */
    log(message) {
        this._parent._log(message);
    }
    /**
     * Starts a performance counter.
     * @param counterName The name of the performance counter
     */
    startPerformanceCounter(counterName) {
        this._parent._startPerformanceCounter(counterName);
    }
    /**
     * Ends a performance counter.
     * @param counterName The name of the performance counter
     */
    endPerformanceCounter(counterName) {
        this._parent._endPerformanceCounter(counterName);
    }
}
/**
 * The default glTF sampler.
 */
GLTFLoader.DefaultSampler = { index: -1 };
GLTFFileLoader._CreateGLTF2Loader = (parent) => new GLTFLoader(parent);

const NAME$x = "EXT_lights_image_based";
/**
 * [Specification](https://github.com/KhronosGroup/glTF/blob/main/extensions/2.0/Vendor/EXT_lights_image_based/README.md)
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
class EXT_lights_image_based {
    /**
     * @internal
     */
    constructor(loader) {
        /**
         * The name of this extension.
         */
        this.name = NAME$x;
        this._loader = loader;
        this.enabled = this._loader.isExtensionUsed(NAME$x);
    }
    /** @internal */
    dispose() {
        this._loader = null;
        delete this._lights;
    }
    /** @internal */
    onLoading() {
        const extensions = this._loader.gltf.extensions;
        if (extensions && extensions[this.name]) {
            const extension = extensions[this.name];
            this._lights = extension.lights;
        }
    }
    /**
     * @internal
     */
    loadSceneAsync(context, scene) {
        return GLTFLoader.LoadExtensionAsync(context, scene, this.name, (extensionContext, extension) => {
            this._loader._allMaterialsDirtyRequired = true;
            const promises = new Array();
            promises.push(this._loader.loadSceneAsync(context, scene));
            this._loader.logOpen(`${extensionContext}`);
            const light = ArrayItem.Get(`${extensionContext}/light`, this._lights, extension.light);
            promises.push(this._loadLightAsync(`/extensions/${this.name}/lights/${extension.light}`, light).then((texture) => {
                this._loader.babylonScene.environmentTexture = texture;
            }));
            this._loader.logClose();
            return Promise.all(promises).then(() => { });
        });
    }
    _loadLightAsync(context, light) {
        if (!light._loaded) {
            const promises = new Array();
            this._loader.logOpen(`${context}`);
            const imageData = new Array(light.specularImages.length);
            for (let mipmap = 0; mipmap < light.specularImages.length; mipmap++) {
                const faces = light.specularImages[mipmap];
                imageData[mipmap] = new Array(faces.length);
                for (let face = 0; face < faces.length; face++) {
                    const specularImageContext = `${context}/specularImages/${mipmap}/${face}`;
                    this._loader.logOpen(`${specularImageContext}`);
                    const index = faces[face];
                    const image = ArrayItem.Get(specularImageContext, this._loader.gltf.images, index);
                    promises.push(this._loader.loadImageAsync(`/images/${index}`, image).then((data) => {
                        imageData[mipmap][face] = data;
                    }));
                    this._loader.logClose();
                }
            }
            this._loader.logClose();
            light._loaded = Promise.all(promises).then(() => {
                const babylonTexture = new RawCubeTexture(this._loader.babylonScene, null, light.specularImageSize);
                babylonTexture.name = light.name || "environment";
                light._babylonTexture = babylonTexture;
                if (light.intensity != undefined) {
                    babylonTexture.level = light.intensity;
                }
                if (light.rotation) {
                    let rotation = Quaternion.FromArray(light.rotation);
                    // Invert the rotation so that positive rotation is counter-clockwise.
                    if (!this._loader.babylonScene.useRightHandedSystem) {
                        rotation = Quaternion.Inverse(rotation);
                    }
                    Matrix.FromQuaternionToRef(rotation, babylonTexture.getReflectionTextureMatrix());
                }
                if (!light.irradianceCoefficients) {
                    throw new Error(`${context}: Irradiance coefficients are missing`);
                }
                const sphericalHarmonics = SphericalHarmonics.FromArray(light.irradianceCoefficients);
                sphericalHarmonics.scaleInPlace(light.intensity);
                sphericalHarmonics.convertIrradianceToLambertianRadiance();
                const sphericalPolynomial = SphericalPolynomial.FromHarmonics(sphericalHarmonics);
                // Compute the lod generation scale to fit exactly to the number of levels available.
                const lodGenerationScale = (imageData.length - 1) / Math.log2(light.specularImageSize);
                return babylonTexture.updateRGBDAsync(imageData, sphericalPolynomial, lodGenerationScale);
            });
        }
        return light._loaded.then(() => {
            return light._babylonTexture;
        });
    }
}
unregisterGLTFExtension(NAME$x);
registerGLTFExtension(NAME$x, true, (loader) => new EXT_lights_image_based(loader));

const NAME$w = "EXT_mesh_gpu_instancing";
/**
 * [Specification](https://github.com/KhronosGroup/glTF/blob/main/extensions/2.0/Vendor/EXT_mesh_gpu_instancing/README.md)
 * [Playground Sample](https://playground.babylonjs.com/#QFIGLW#9)
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
class EXT_mesh_gpu_instancing {
    /**
     * @internal
     */
    constructor(loader) {
        /**
         * The name of this extension.
         */
        this.name = NAME$w;
        this._loader = loader;
        this.enabled = this._loader.isExtensionUsed(NAME$w);
    }
    /** @internal */
    dispose() {
        this._loader = null;
    }
    /**
     * @internal
     */
    loadNodeAsync(context, node, assign) {
        return GLTFLoader.LoadExtensionAsync(context, node, this.name, (extensionContext, extension) => {
            this._loader._disableInstancedMesh++;
            const promise = this._loader.loadNodeAsync(`/nodes/${node.index}`, node, assign);
            this._loader._disableInstancedMesh--;
            if (!node._primitiveBabylonMeshes) {
                return promise;
            }
            const promises = new Array();
            let instanceCount = 0;
            const loadAttribute = (attribute) => {
                if (extension.attributes[attribute] == undefined) {
                    promises.push(Promise.resolve(null));
                    return;
                }
                const accessor = ArrayItem.Get(`${extensionContext}/attributes/${attribute}`, this._loader.gltf.accessors, extension.attributes[attribute]);
                promises.push(this._loader._loadFloatAccessorAsync(`/accessors/${accessor.bufferView}`, accessor));
                if (instanceCount === 0) {
                    instanceCount = accessor.count;
                }
                else if (instanceCount !== accessor.count) {
                    throw new Error(`${extensionContext}/attributes: Instance buffer accessors do not have the same count.`);
                }
            };
            loadAttribute("TRANSLATION");
            loadAttribute("ROTATION");
            loadAttribute("SCALE");
            return promise.then((babylonTransformNode) => {
                return Promise.all(promises).then(([translationBuffer, rotationBuffer, scaleBuffer]) => {
                    const matrices = new Float32Array(instanceCount * 16);
                    TmpVectors.Vector3[0].copyFromFloats(0, 0, 0); // translation
                    TmpVectors.Quaternion[0].copyFromFloats(0, 0, 0, 1); // rotation
                    TmpVectors.Vector3[1].copyFromFloats(1, 1, 1); // scale
                    for (let i = 0; i < instanceCount; ++i) {
                        translationBuffer && Vector3.FromArrayToRef(translationBuffer, i * 3, TmpVectors.Vector3[0]);
                        rotationBuffer && Quaternion.FromArrayToRef(rotationBuffer, i * 4, TmpVectors.Quaternion[0]);
                        scaleBuffer && Vector3.FromArrayToRef(scaleBuffer, i * 3, TmpVectors.Vector3[1]);
                        Matrix.ComposeToRef(TmpVectors.Vector3[1], TmpVectors.Quaternion[0], TmpVectors.Vector3[0], TmpVectors.Matrix[0]);
                        TmpVectors.Matrix[0].copyToArray(matrices, i * 16);
                    }
                    for (const babylonMesh of node._primitiveBabylonMeshes) {
                        babylonMesh.thinInstanceSetBuffer("matrix", matrices, 16, true);
                    }
                    return babylonTransformNode;
                });
            });
        });
    }
}
unregisterGLTFExtension(NAME$w);
registerGLTFExtension(NAME$w, true, (loader) => new EXT_mesh_gpu_instancing(loader));

const NAME$v = "EXT_meshopt_compression";
/**
 * [Specification](https://github.com/KhronosGroup/glTF/blob/main/extensions/2.0/Vendor/EXT_meshopt_compression/README.md)
 *
 * This extension uses a WebAssembly decoder module from https://github.com/zeux/meshoptimizer/tree/master/js
 * @since 5.0.0
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
class EXT_meshopt_compression {
    /**
     * @internal
     */
    constructor(loader) {
        /**
         * The name of this extension.
         */
        this.name = NAME$v;
        this.enabled = loader.isExtensionUsed(NAME$v);
        this._loader = loader;
    }
    /** @internal */
    dispose() {
        this._loader = null;
    }
    /**
     * @internal
     */
    loadBufferViewAsync(context, bufferView) {
        return GLTFLoader.LoadExtensionAsync(context, bufferView, this.name, (extensionContext, extension) => {
            const bufferViewMeshopt = bufferView;
            if (bufferViewMeshopt._meshOptData) {
                return bufferViewMeshopt._meshOptData;
            }
            const buffer = ArrayItem.Get(`${context}/buffer`, this._loader.gltf.buffers, extension.buffer);
            bufferViewMeshopt._meshOptData = this._loader.loadBufferAsync(`/buffers/${buffer.index}`, buffer, extension.byteOffset || 0, extension.byteLength).then((buffer) => {
                return MeshoptCompression.Default.decodeGltfBufferAsync(buffer, extension.count, extension.byteStride, extension.mode, extension.filter);
            });
            return bufferViewMeshopt._meshOptData;
        });
    }
}
unregisterGLTFExtension(NAME$v);
registerGLTFExtension(NAME$v, true, (loader) => new EXT_meshopt_compression(loader));

const NAME$u = "EXT_texture_webp";
/**
 * [Specification](https://github.com/KhronosGroup/glTF/blob/main/extensions/2.0/Vendor/EXT_texture_webp/README.md)
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
class EXT_texture_webp {
    /**
     * @internal
     */
    constructor(loader) {
        /** The name of this extension. */
        this.name = NAME$u;
        this._loader = loader;
        this.enabled = loader.isExtensionUsed(NAME$u);
    }
    /** @internal */
    dispose() {
        this._loader = null;
    }
    /**
     * @internal
     */
    _loadTextureAsync(context, texture, assign) {
        return GLTFLoader.LoadExtensionAsync(context, texture, this.name, (extensionContext, extension) => {
            const sampler = texture.sampler == undefined ? GLTFLoader.DefaultSampler : ArrayItem.Get(`${context}/sampler`, this._loader.gltf.samplers, texture.sampler);
            const image = ArrayItem.Get(`${extensionContext}/source`, this._loader.gltf.images, extension.source);
            return this._loader._createTextureAsync(context, sampler, image, (babylonTexture) => {
                assign(babylonTexture);
            }, undefined, !texture._textureInfo.nonColorData);
        });
    }
}
unregisterGLTFExtension(NAME$u);
registerGLTFExtension(NAME$u, true, (loader) => new EXT_texture_webp(loader));

const NAME$t = "EXT_texture_avif";
/**
 * [glTF PR](https://github.com/KhronosGroup/glTF/pull/2235)
 * [Specification](https://github.com/KhronosGroup/glTF/blob/main/extensions/2.0/Vendor/EXT_texture_avif/README.md)
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
class EXT_texture_avif {
    /**
     * @internal
     */
    constructor(loader) {
        /** The name of this extension. */
        this.name = NAME$t;
        this._loader = loader;
        this.enabled = loader.isExtensionUsed(NAME$t);
    }
    /** @internal */
    dispose() {
        this._loader = null;
    }
    /**
     * @internal
     */
    _loadTextureAsync(context, texture, assign) {
        return GLTFLoader.LoadExtensionAsync(context, texture, this.name, (extensionContext, extension) => {
            const sampler = texture.sampler == undefined ? GLTFLoader.DefaultSampler : ArrayItem.Get(`${context}/sampler`, this._loader.gltf.samplers, texture.sampler);
            const image = ArrayItem.Get(`${extensionContext}/source`, this._loader.gltf.images, extension.source);
            return this._loader._createTextureAsync(context, sampler, image, (babylonTexture) => {
                assign(babylonTexture);
            }, undefined, !texture._textureInfo.nonColorData);
        });
    }
}
unregisterGLTFExtension(NAME$t);
registerGLTFExtension(NAME$t, true, (loader) => new EXT_texture_avif(loader));

const NAME$s = "EXT_lights_ies";
/**
 * [Specification](https://github.com/KhronosGroup/glTF/tree/main/extensions/2.0/Vendor/EXT_lights_ies)
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
class EXT_lights_ies {
    /**
     * @internal
     */
    constructor(loader) {
        /**
         * The name of this extension.
         */
        this.name = NAME$s;
        this._loader = loader;
        this.enabled = this._loader.isExtensionUsed(NAME$s);
    }
    /** @internal */
    dispose() {
        this._loader = null;
        delete this._lights;
    }
    /** @internal */
    onLoading() {
        const extensions = this._loader.gltf.extensions;
        if (extensions && extensions[this.name]) {
            const extension = extensions[this.name];
            this._lights = extension.lights;
            ArrayItem.Assign(this._lights);
        }
    }
    /**
     * @internal
     */
    loadNodeAsync(context, node, assign) {
        return GLTFLoader.LoadExtensionAsync(context, node, this.name, async (extensionContext, extension) => {
            this._loader._allMaterialsDirtyRequired = true;
            let babylonSpotLight;
            let light;
            const transformNode = await this._loader.loadNodeAsync(context, node, (babylonMesh) => {
                light = ArrayItem.Get(extensionContext, this._lights, extension.light);
                const name = light.name || babylonMesh.name;
                this._loader.babylonScene._blockEntityCollection = !!this._loader._assetContainer;
                babylonSpotLight = new SpotLight(name, Vector3.Zero(), Vector3.Backward(), 0, 1, this._loader.babylonScene);
                babylonSpotLight.angle = Math.PI / 2;
                babylonSpotLight.innerAngle = 0;
                babylonSpotLight._parentContainer = this._loader._assetContainer;
                this._loader.babylonScene._blockEntityCollection = false;
                light._babylonLight = babylonSpotLight;
                babylonSpotLight.falloffType = Light.FALLOFF_GLTF;
                babylonSpotLight.diffuse = extension.color ? Color3.FromArray(extension.color) : Color3.White();
                babylonSpotLight.intensity = extension.multiplier || 1;
                babylonSpotLight.range = Number.MAX_VALUE;
                babylonSpotLight.parent = babylonMesh;
                this._loader._babylonLights.push(babylonSpotLight);
                GLTFLoader.AddPointerMetadata(babylonSpotLight, extensionContext);
                assign(babylonMesh);
            });
            // Load the profile
            let bufferData;
            if (light.uri) {
                bufferData = await this._loader.loadUriAsync(context, light, light.uri);
            }
            else {
                const bufferView = ArrayItem.Get(`${context}/bufferView`, this._loader.gltf.bufferViews, light.bufferView);
                bufferData = await this._loader.loadBufferViewAsync(`/bufferViews/${bufferView.index}`, bufferView);
            }
            babylonSpotLight.iesProfileTexture = new Texture(name + "_iesProfile", this._loader.babylonScene, true, false, undefined, null, null, bufferData, true, undefined, undefined, undefined, undefined, ".ies");
            return transformNode;
        });
    }
}
unregisterGLTFExtension(NAME$s);
registerGLTFExtension(NAME$s, true, (loader) => new EXT_lights_ies(loader));

const NAME$r = "KHR_draco_mesh_compression";
/**
 * [Specification](https://github.com/KhronosGroup/glTF/blob/main/extensions/2.0/Khronos/KHR_draco_mesh_compression/README.md)
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
class KHR_draco_mesh_compression {
    /**
     * @internal
     */
    constructor(loader) {
        /**
         * The name of this extension.
         */
        this.name = NAME$r;
        /**
         * Defines whether to use the normalized flag from the glTF accessor instead of the Draco data. Defaults to true.
         */
        this.useNormalizedFlagFromAccessor = true;
        this._loader = loader;
        this.enabled = DracoDecoder.DefaultAvailable && this._loader.isExtensionUsed(NAME$r);
    }
    /** @internal */
    dispose() {
        delete this.dracoDecoder;
        this._loader = null;
    }
    /**
     * @internal
     */
    _loadVertexDataAsync(context, primitive, babylonMesh) {
        return GLTFLoader.LoadExtensionAsync(context, primitive, this.name, (extensionContext, extension) => {
            if (primitive.mode != undefined) {
                if (primitive.mode !== 4 /* MeshPrimitiveMode.TRIANGLES */ && primitive.mode !== 5 /* MeshPrimitiveMode.TRIANGLE_STRIP */) {
                    throw new Error(`${context}: Unsupported mode ${primitive.mode}`);
                }
            }
            const attributes = {};
            const normalized = {};
            const loadAttribute = (name, kind) => {
                const uniqueId = extension.attributes[name];
                if (uniqueId == undefined) {
                    return;
                }
                babylonMesh._delayInfo = babylonMesh._delayInfo || [];
                if (babylonMesh._delayInfo.indexOf(kind) === -1) {
                    babylonMesh._delayInfo.push(kind);
                }
                attributes[kind] = uniqueId;
                if (this.useNormalizedFlagFromAccessor) {
                    const accessor = ArrayItem.TryGet(this._loader.gltf.accessors, primitive.attributes[name]);
                    if (accessor) {
                        normalized[kind] = accessor.normalized || false;
                    }
                }
            };
            loadAttribute("POSITION", VertexBuffer.PositionKind);
            loadAttribute("NORMAL", VertexBuffer.NormalKind);
            loadAttribute("TANGENT", VertexBuffer.TangentKind);
            loadAttribute("TEXCOORD_0", VertexBuffer.UVKind);
            loadAttribute("TEXCOORD_1", VertexBuffer.UV2Kind);
            loadAttribute("TEXCOORD_2", VertexBuffer.UV3Kind);
            loadAttribute("TEXCOORD_3", VertexBuffer.UV4Kind);
            loadAttribute("TEXCOORD_4", VertexBuffer.UV5Kind);
            loadAttribute("TEXCOORD_5", VertexBuffer.UV6Kind);
            loadAttribute("JOINTS_0", VertexBuffer.MatricesIndicesKind);
            loadAttribute("WEIGHTS_0", VertexBuffer.MatricesWeightsKind);
            loadAttribute("COLOR_0", VertexBuffer.ColorKind);
            const bufferView = ArrayItem.Get(extensionContext, this._loader.gltf.bufferViews, extension.bufferView);
            if (!bufferView._dracoBabylonGeometry) {
                bufferView._dracoBabylonGeometry = this._loader.loadBufferViewAsync(`/bufferViews/${bufferView.index}`, bufferView).then((data) => {
                    const dracoDecoder = this.dracoDecoder || DracoDecoder.Default;
                    const positionAccessor = ArrayItem.TryGet(this._loader.gltf.accessors, primitive.attributes["POSITION"]);
                    const babylonBoundingInfo = !this._loader.parent.alwaysComputeBoundingBox && !babylonMesh.skeleton && positionAccessor ? LoadBoundingInfoFromPositionAccessor(positionAccessor) : null;
                    return dracoDecoder
                        ._decodeMeshToGeometryForGltfAsync(babylonMesh.name, this._loader.babylonScene, data, attributes, normalized, babylonBoundingInfo)
                        .catch((error) => {
                        throw new Error(`${context}: ${error.message}`);
                    });
                });
            }
            return bufferView._dracoBabylonGeometry;
        });
    }
}
unregisterGLTFExtension(NAME$r);
registerGLTFExtension(NAME$r, true, (loader) => new KHR_draco_mesh_compression(loader));

const NAME$q = "KHR_lights_punctual";
/**
 * [Specification](https://github.com/KhronosGroup/glTF/blob/main/extensions/2.0/Khronos/KHR_lights_punctual/README.md)
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
class KHR_lights {
    /**
     * @internal
     */
    constructor(loader) {
        /**
         * The name of this extension.
         */
        this.name = NAME$q;
        this._loader = loader;
        this.enabled = this._loader.isExtensionUsed(NAME$q);
    }
    /** @internal */
    dispose() {
        this._loader = null;
        delete this._lights;
    }
    /** @internal */
    onLoading() {
        const extensions = this._loader.gltf.extensions;
        if (extensions && extensions[this.name]) {
            const extension = extensions[this.name];
            this._lights = extension.lights;
            ArrayItem.Assign(this._lights);
        }
    }
    /**
     * @internal
     */
    loadNodeAsync(context, node, assign) {
        return GLTFLoader.LoadExtensionAsync(context, node, this.name, (extensionContext, extension) => {
            this._loader._allMaterialsDirtyRequired = true;
            return this._loader.loadNodeAsync(context, node, (babylonMesh) => {
                let babylonLight;
                const light = ArrayItem.Get(extensionContext, this._lights, extension.light);
                const name = light.name || babylonMesh.name;
                this._loader.babylonScene._blockEntityCollection = !!this._loader._assetContainer;
                switch (light.type) {
                    case "directional" /* KHRLightsPunctual_LightType.DIRECTIONAL */: {
                        const babylonDirectionalLight = new DirectionalLight(name, Vector3.Backward(), this._loader.babylonScene);
                        babylonDirectionalLight.position.setAll(0);
                        babylonLight = babylonDirectionalLight;
                        break;
                    }
                    case "point" /* KHRLightsPunctual_LightType.POINT */: {
                        babylonLight = new PointLight(name, Vector3.Zero(), this._loader.babylonScene);
                        break;
                    }
                    case "spot" /* KHRLightsPunctual_LightType.SPOT */: {
                        const babylonSpotLight = new SpotLight(name, Vector3.Zero(), Vector3.Backward(), 0, 1, this._loader.babylonScene);
                        babylonSpotLight.angle = ((light.spot && light.spot.outerConeAngle) || Math.PI / 4) * 2;
                        babylonSpotLight.innerAngle = ((light.spot && light.spot.innerConeAngle) || 0) * 2;
                        babylonLight = babylonSpotLight;
                        break;
                    }
                    default: {
                        this._loader.babylonScene._blockEntityCollection = false;
                        throw new Error(`${extensionContext}: Invalid light type (${light.type})`);
                    }
                }
                babylonLight._parentContainer = this._loader._assetContainer;
                this._loader.babylonScene._blockEntityCollection = false;
                light._babylonLight = babylonLight;
                babylonLight.falloffType = Light.FALLOFF_GLTF;
                babylonLight.diffuse = light.color ? Color3.FromArray(light.color) : Color3.White();
                babylonLight.intensity = light.intensity == undefined ? 1 : light.intensity;
                babylonLight.range = light.range == undefined ? Number.MAX_VALUE : light.range;
                babylonLight.parent = babylonMesh;
                this._loader._babylonLights.push(babylonLight);
                GLTFLoader.AddPointerMetadata(babylonLight, extensionContext);
                assign(babylonMesh);
            });
        });
    }
}
unregisterGLTFExtension(NAME$q);
registerGLTFExtension(NAME$q, true, (loader) => new KHR_lights(loader));

const NAME$p = "KHR_materials_pbrSpecularGlossiness";
/**
 * [Specification](https://github.com/KhronosGroup/glTF/blob/main/extensions/2.0/Archived/KHR_materials_pbrSpecularGlossiness/README.md)
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
class KHR_materials_pbrSpecularGlossiness {
    /**
     * @internal
     */
    constructor(loader) {
        /**
         * The name of this extension.
         */
        this.name = NAME$p;
        /**
         * Defines a number that determines the order the extensions are applied.
         */
        this.order = 200;
        this._loader = loader;
        this.enabled = this._loader.isExtensionUsed(NAME$p);
    }
    /** @internal */
    dispose() {
        this._loader = null;
    }
    /**
     * @internal
     */
    loadMaterialPropertiesAsync(context, material, babylonMaterial) {
        return GLTFLoader.LoadExtensionAsync(context, material, this.name, (extensionContext, extension) => {
            const promises = new Array();
            promises.push(this._loader.loadMaterialBasePropertiesAsync(context, material, babylonMaterial));
            promises.push(this._loadSpecularGlossinessPropertiesAsync(extensionContext, extension, babylonMaterial));
            this._loader.loadMaterialAlphaProperties(context, material, babylonMaterial);
            return Promise.all(promises).then(() => { });
        });
    }
    _loadSpecularGlossinessPropertiesAsync(context, properties, babylonMaterial) {
        if (!(babylonMaterial instanceof PBRMaterial)) {
            throw new Error(`${context}: Material type not supported`);
        }
        const promises = new Array();
        babylonMaterial.metallic = null;
        babylonMaterial.roughness = null;
        if (properties.diffuseFactor) {
            babylonMaterial.albedoColor = Color3.FromArray(properties.diffuseFactor);
            babylonMaterial.alpha = properties.diffuseFactor[3];
        }
        else {
            babylonMaterial.albedoColor = Color3.White();
        }
        babylonMaterial.reflectivityColor = properties.specularFactor ? Color3.FromArray(properties.specularFactor) : Color3.White();
        babylonMaterial.microSurface = properties.glossinessFactor == undefined ? 1 : properties.glossinessFactor;
        if (properties.diffuseTexture) {
            promises.push(this._loader.loadTextureInfoAsync(`${context}/diffuseTexture`, properties.diffuseTexture, (texture) => {
                texture.name = `${babylonMaterial.name} (Diffuse)`;
                babylonMaterial.albedoTexture = texture;
            }));
        }
        if (properties.specularGlossinessTexture) {
            promises.push(this._loader.loadTextureInfoAsync(`${context}/specularGlossinessTexture`, properties.specularGlossinessTexture, (texture) => {
                texture.name = `${babylonMaterial.name} (Specular Glossiness)`;
                babylonMaterial.reflectivityTexture = texture;
                babylonMaterial.reflectivityTexture.hasAlpha = true;
            }));
            babylonMaterial.useMicroSurfaceFromReflectivityMapAlpha = true;
        }
        return Promise.all(promises).then(() => { });
    }
}
unregisterGLTFExtension(NAME$p);
registerGLTFExtension(NAME$p, true, (loader) => new KHR_materials_pbrSpecularGlossiness(loader));

const NAME$o = "KHR_materials_unlit";
/**
 * [Specification](https://github.com/KhronosGroup/glTF/blob/main/extensions/2.0/Khronos/KHR_materials_unlit/README.md)
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
class KHR_materials_unlit {
    /**
     * @internal
     */
    constructor(loader) {
        /**
         * The name of this extension.
         */
        this.name = NAME$o;
        /**
         * Defines a number that determines the order the extensions are applied.
         */
        this.order = 210;
        this._loader = loader;
        this.enabled = this._loader.isExtensionUsed(NAME$o);
    }
    /** @internal */
    dispose() {
        this._loader = null;
    }
    /**
     * @internal
     */
    loadMaterialPropertiesAsync(context, material, babylonMaterial) {
        return GLTFLoader.LoadExtensionAsync(context, material, this.name, () => {
            return this._loadUnlitPropertiesAsync(context, material, babylonMaterial);
        });
    }
    _loadUnlitPropertiesAsync(context, material, babylonMaterial) {
        if (!(babylonMaterial instanceof PBRMaterial)) {
            throw new Error(`${context}: Material type not supported`);
        }
        const promises = new Array();
        babylonMaterial.unlit = true;
        const properties = material.pbrMetallicRoughness;
        if (properties) {
            if (properties.baseColorFactor) {
                babylonMaterial.albedoColor = Color3.FromArray(properties.baseColorFactor);
                babylonMaterial.alpha = properties.baseColorFactor[3];
            }
            else {
                babylonMaterial.albedoColor = Color3.White();
            }
            if (properties.baseColorTexture) {
                promises.push(this._loader.loadTextureInfoAsync(`${context}/baseColorTexture`, properties.baseColorTexture, (texture) => {
                    texture.name = `${babylonMaterial.name} (Base Color)`;
                    babylonMaterial.albedoTexture = texture;
                }));
            }
        }
        if (material.doubleSided) {
            babylonMaterial.backFaceCulling = false;
            babylonMaterial.twoSidedLighting = true;
        }
        this._loader.loadMaterialAlphaProperties(context, material, babylonMaterial);
        return Promise.all(promises).then(() => { });
    }
}
unregisterGLTFExtension(NAME$o);
registerGLTFExtension(NAME$o, true, (loader) => new KHR_materials_unlit(loader));

const NAME$n = "KHR_materials_clearcoat";
/**
 * [Specification](https://github.com/KhronosGroup/glTF/blob/main/extensions/2.0/Khronos/KHR_materials_clearcoat/README.md)
 * [Playground Sample](https://www.babylonjs-playground.com/frame.html#7F7PN6#8)
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
class KHR_materials_clearcoat {
    /**
     * @internal
     */
    constructor(loader) {
        /**
         * The name of this extension.
         */
        this.name = NAME$n;
        /**
         * Defines a number that determines the order the extensions are applied.
         */
        this.order = 190;
        this._loader = loader;
        this.enabled = this._loader.isExtensionUsed(NAME$n);
    }
    /** @internal */
    dispose() {
        this._loader = null;
    }
    /**
     * @internal
     */
    loadMaterialPropertiesAsync(context, material, babylonMaterial) {
        return GLTFLoader.LoadExtensionAsync(context, material, this.name, (extensionContext, extension) => {
            const promises = new Array();
            promises.push(this._loader.loadMaterialPropertiesAsync(context, material, babylonMaterial));
            promises.push(this._loadClearCoatPropertiesAsync(extensionContext, extension, babylonMaterial));
            return Promise.all(promises).then(() => { });
        });
    }
    _loadClearCoatPropertiesAsync(context, properties, babylonMaterial) {
        if (!(babylonMaterial instanceof PBRMaterial)) {
            throw new Error(`${context}: Material type not supported`);
        }
        const promises = new Array();
        babylonMaterial.clearCoat.isEnabled = true;
        babylonMaterial.clearCoat.useRoughnessFromMainTexture = false;
        babylonMaterial.clearCoat.remapF0OnInterfaceChange = false;
        if (properties.clearcoatFactor != undefined) {
            babylonMaterial.clearCoat.intensity = properties.clearcoatFactor;
        }
        else {
            babylonMaterial.clearCoat.intensity = 0;
        }
        if (properties.clearcoatTexture) {
            promises.push(this._loader.loadTextureInfoAsync(`${context}/clearcoatTexture`, properties.clearcoatTexture, (texture) => {
                texture.name = `${babylonMaterial.name} (ClearCoat)`;
                babylonMaterial.clearCoat.texture = texture;
            }));
        }
        if (properties.clearcoatRoughnessFactor != undefined) {
            babylonMaterial.clearCoat.roughness = properties.clearcoatRoughnessFactor;
        }
        else {
            babylonMaterial.clearCoat.roughness = 0;
        }
        if (properties.clearcoatRoughnessTexture) {
            properties.clearcoatRoughnessTexture.nonColorData = true;
            promises.push(this._loader.loadTextureInfoAsync(`${context}/clearcoatRoughnessTexture`, properties.clearcoatRoughnessTexture, (texture) => {
                texture.name = `${babylonMaterial.name} (ClearCoat Roughness)`;
                babylonMaterial.clearCoat.textureRoughness = texture;
            }));
        }
        if (properties.clearcoatNormalTexture) {
            properties.clearcoatNormalTexture.nonColorData = true;
            promises.push(this._loader.loadTextureInfoAsync(`${context}/clearcoatNormalTexture`, properties.clearcoatNormalTexture, (texture) => {
                texture.name = `${babylonMaterial.name} (ClearCoat Normal)`;
                babylonMaterial.clearCoat.bumpTexture = texture;
            }));
            babylonMaterial.invertNormalMapX = !babylonMaterial.getScene().useRightHandedSystem;
            babylonMaterial.invertNormalMapY = babylonMaterial.getScene().useRightHandedSystem;
            if (properties.clearcoatNormalTexture.scale != undefined) {
                babylonMaterial.clearCoat.bumpTexture.level = properties.clearcoatNormalTexture.scale;
            }
        }
        return Promise.all(promises).then(() => { });
    }
}
unregisterGLTFExtension(NAME$n);
registerGLTFExtension(NAME$n, true, (loader) => new KHR_materials_clearcoat(loader));

const NAME$m = "KHR_materials_iridescence";
/**
 * [Specification](https://github.com/KhronosGroup/glTF/blob/main/extensions/2.0/Khronos/KHR_materials_iridescence/README.md)
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
class KHR_materials_iridescence {
    /**
     * @internal
     */
    constructor(loader) {
        /**
         * The name of this extension.
         */
        this.name = NAME$m;
        /**
         * Defines a number that determines the order the extensions are applied.
         */
        this.order = 195;
        this._loader = loader;
        this.enabled = this._loader.isExtensionUsed(NAME$m);
    }
    /** @internal */
    dispose() {
        this._loader = null;
    }
    /**
     * @internal
     */
    loadMaterialPropertiesAsync(context, material, babylonMaterial) {
        return GLTFLoader.LoadExtensionAsync(context, material, this.name, (extensionContext, extension) => {
            const promises = new Array();
            promises.push(this._loader.loadMaterialPropertiesAsync(context, material, babylonMaterial));
            promises.push(this._loadIridescencePropertiesAsync(extensionContext, extension, babylonMaterial));
            return Promise.all(promises).then(() => { });
        });
    }
    _loadIridescencePropertiesAsync(context, properties, babylonMaterial) {
        if (!(babylonMaterial instanceof PBRMaterial)) {
            throw new Error(`${context}: Material type not supported`);
        }
        const promises = new Array();
        babylonMaterial.iridescence.isEnabled = true;
        babylonMaterial.iridescence.intensity = properties.iridescenceFactor ?? 0;
        babylonMaterial.iridescence.indexOfRefraction = properties.iridescenceIor ?? properties.iridescenceIOR ?? 1.3;
        babylonMaterial.iridescence.minimumThickness = properties.iridescenceThicknessMinimum ?? 100;
        babylonMaterial.iridescence.maximumThickness = properties.iridescenceThicknessMaximum ?? 400;
        if (properties.iridescenceTexture) {
            promises.push(this._loader.loadTextureInfoAsync(`${context}/iridescenceTexture`, properties.iridescenceTexture, (texture) => {
                texture.name = `${babylonMaterial.name} (Iridescence)`;
                babylonMaterial.iridescence.texture = texture;
            }));
        }
        if (properties.iridescenceThicknessTexture) {
            promises.push(this._loader.loadTextureInfoAsync(`${context}/iridescenceThicknessTexture`, properties.iridescenceThicknessTexture, (texture) => {
                texture.name = `${babylonMaterial.name} (Iridescence Thickness)`;
                babylonMaterial.iridescence.thicknessTexture = texture;
            }));
        }
        return Promise.all(promises).then(() => { });
    }
}
unregisterGLTFExtension(NAME$m);
registerGLTFExtension(NAME$m, true, (loader) => new KHR_materials_iridescence(loader));

const NAME$l = "KHR_materials_anisotropy";
/**
 * [Specification](https://github.com/KhronosGroup/glTF/tree/main/extensions/2.0/Khronos/KHR_materials_anisotropy)
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
class KHR_materials_anisotropy {
    /**
     * @internal
     */
    constructor(loader) {
        /**
         * The name of this extension.
         */
        this.name = NAME$l;
        /**
         * Defines a number that determines the order the extensions are applied.
         */
        this.order = 195;
        this._loader = loader;
        this.enabled = this._loader.isExtensionUsed(NAME$l);
    }
    /** @internal */
    dispose() {
        this._loader = null;
    }
    /**
     * @internal
     */
    loadMaterialPropertiesAsync(context, material, babylonMaterial) {
        return GLTFLoader.LoadExtensionAsync(context, material, this.name, (extensionContext, extension) => {
            const promises = new Array();
            promises.push(this._loader.loadMaterialPropertiesAsync(context, material, babylonMaterial));
            promises.push(this._loadIridescencePropertiesAsync(extensionContext, extension, babylonMaterial));
            return Promise.all(promises).then(() => { });
        });
    }
    _loadIridescencePropertiesAsync(context, properties, babylonMaterial) {
        if (!(babylonMaterial instanceof PBRMaterial)) {
            throw new Error(`${context}: Material type not supported`);
        }
        const promises = new Array();
        babylonMaterial.anisotropy.isEnabled = true;
        babylonMaterial.anisotropy.intensity = properties.anisotropyStrength ?? 0;
        babylonMaterial.anisotropy.angle = properties.anisotropyRotation ?? 0;
        if (properties.anisotropyTexture) {
            properties.anisotropyTexture.nonColorData = true;
            promises.push(this._loader.loadTextureInfoAsync(`${context}/anisotropyTexture`, properties.anisotropyTexture, (texture) => {
                texture.name = `${babylonMaterial.name} (Anisotropy Intensity)`;
                babylonMaterial.anisotropy.texture = texture;
            }));
        }
        return Promise.all(promises).then(() => { });
    }
}
unregisterGLTFExtension(NAME$l);
registerGLTFExtension(NAME$l, true, (loader) => new KHR_materials_anisotropy(loader));

const NAME$k = "KHR_materials_emissive_strength";
/**
 * [Specification](https://github.com/KhronosGroup/glTF/blob/main/extensions/2.0/Khronos/KHR_materials_emissive_strength/README.md)
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
class KHR_materials_emissive_strength {
    /**
     * @internal
     */
    constructor(loader) {
        /**
         * The name of this extension.
         */
        this.name = NAME$k;
        /**
         * Defines a number that determines the order the extensions are applied.
         */
        this.order = 170;
        this._loader = loader;
        this.enabled = this._loader.isExtensionUsed(NAME$k);
    }
    /** @internal */
    dispose() {
        this._loader = null;
    }
    /**
     * @internal
     */
    loadMaterialPropertiesAsync(context, material, babylonMaterial) {
        return GLTFLoader.LoadExtensionAsync(context, material, this.name, (extensionContext, extension) => {
            return this._loader.loadMaterialPropertiesAsync(context, material, babylonMaterial).then(() => {
                this._loadEmissiveProperties(extensionContext, extension, babylonMaterial);
            });
        });
    }
    _loadEmissiveProperties(context, properties, babylonMaterial) {
        if (!(babylonMaterial instanceof PBRMaterial)) {
            throw new Error(`${context}: Material type not supported`);
        }
        if (properties.emissiveStrength !== undefined) {
            babylonMaterial.emissiveIntensity = properties.emissiveStrength;
        }
    }
}
unregisterGLTFExtension(NAME$k);
registerGLTFExtension(NAME$k, true, (loader) => new KHR_materials_emissive_strength(loader));

const NAME$j = "KHR_materials_sheen";
/**
 * [Specification](https://github.com/KhronosGroup/glTF/blob/main/extensions/2.0/Khronos/KHR_materials_sheen/README.md)
 * [Playground Sample](https://www.babylonjs-playground.com/frame.html#BNIZX6#4)
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
class KHR_materials_sheen {
    /**
     * @internal
     */
    constructor(loader) {
        /**
         * The name of this extension.
         */
        this.name = NAME$j;
        /**
         * Defines a number that determines the order the extensions are applied.
         */
        this.order = 190;
        this._loader = loader;
        this.enabled = this._loader.isExtensionUsed(NAME$j);
    }
    /** @internal */
    dispose() {
        this._loader = null;
    }
    /**
     * @internal
     */
    loadMaterialPropertiesAsync(context, material, babylonMaterial) {
        return GLTFLoader.LoadExtensionAsync(context, material, this.name, (extensionContext, extension) => {
            const promises = new Array();
            promises.push(this._loader.loadMaterialPropertiesAsync(context, material, babylonMaterial));
            promises.push(this._loadSheenPropertiesAsync(extensionContext, extension, babylonMaterial));
            return Promise.all(promises).then(() => { });
        });
    }
    _loadSheenPropertiesAsync(context, properties, babylonMaterial) {
        if (!(babylonMaterial instanceof PBRMaterial)) {
            throw new Error(`${context}: Material type not supported`);
        }
        const promises = new Array();
        babylonMaterial.sheen.isEnabled = true;
        babylonMaterial.sheen.intensity = 1;
        if (properties.sheenColorFactor != undefined) {
            babylonMaterial.sheen.color = Color3.FromArray(properties.sheenColorFactor);
        }
        else {
            babylonMaterial.sheen.color = Color3.Black();
        }
        if (properties.sheenColorTexture) {
            promises.push(this._loader.loadTextureInfoAsync(`${context}/sheenColorTexture`, properties.sheenColorTexture, (texture) => {
                texture.name = `${babylonMaterial.name} (Sheen Color)`;
                babylonMaterial.sheen.texture = texture;
            }));
        }
        if (properties.sheenRoughnessFactor !== undefined) {
            babylonMaterial.sheen.roughness = properties.sheenRoughnessFactor;
        }
        else {
            babylonMaterial.sheen.roughness = 0;
        }
        if (properties.sheenRoughnessTexture) {
            properties.sheenRoughnessTexture.nonColorData = true;
            promises.push(this._loader.loadTextureInfoAsync(`${context}/sheenRoughnessTexture`, properties.sheenRoughnessTexture, (texture) => {
                texture.name = `${babylonMaterial.name} (Sheen Roughness)`;
                babylonMaterial.sheen.textureRoughness = texture;
            }));
        }
        babylonMaterial.sheen.albedoScaling = true;
        babylonMaterial.sheen.useRoughnessFromMainTexture = false;
        return Promise.all(promises).then(() => { });
    }
}
unregisterGLTFExtension(NAME$j);
registerGLTFExtension(NAME$j, true, (loader) => new KHR_materials_sheen(loader));

const NAME$i = "KHR_materials_specular";
/**
 * [Specification](https://github.com/KhronosGroup/glTF/blob/main/extensions/2.0/Khronos/KHR_materials_specular/README.md)
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
class KHR_materials_specular {
    /**
     * @internal
     */
    constructor(loader) {
        /**
         * The name of this extension.
         */
        this.name = NAME$i;
        /**
         * Defines a number that determines the order the extensions are applied.
         */
        this.order = 190;
        this._loader = loader;
        this.enabled = this._loader.isExtensionUsed(NAME$i);
    }
    /** @internal */
    dispose() {
        this._loader = null;
    }
    /**
     * @internal
     */
    loadMaterialPropertiesAsync(context, material, babylonMaterial) {
        return GLTFLoader.LoadExtensionAsync(context, material, this.name, (extensionContext, extension) => {
            const promises = new Array();
            promises.push(this._loader.loadMaterialPropertiesAsync(context, material, babylonMaterial));
            promises.push(this._loadSpecularPropertiesAsync(extensionContext, extension, babylonMaterial));
            return Promise.all(promises).then(() => { });
        });
    }
    _loadSpecularPropertiesAsync(context, properties, babylonMaterial) {
        if (!(babylonMaterial instanceof PBRMaterial)) {
            throw new Error(`${context}: Material type not supported`);
        }
        const promises = new Array();
        if (properties.specularFactor !== undefined) {
            babylonMaterial.metallicF0Factor = properties.specularFactor;
        }
        if (properties.specularColorFactor !== undefined) {
            babylonMaterial.metallicReflectanceColor = Color3.FromArray(properties.specularColorFactor);
        }
        if (properties.specularTexture) {
            properties.specularTexture.nonColorData = true;
            promises.push(this._loader.loadTextureInfoAsync(`${context}/specularTexture`, properties.specularTexture, (texture) => {
                texture.name = `${babylonMaterial.name} (Specular)`;
                babylonMaterial.metallicReflectanceTexture = texture;
                babylonMaterial.useOnlyMetallicFromMetallicReflectanceTexture = true;
            }));
        }
        if (properties.specularColorTexture) {
            promises.push(this._loader.loadTextureInfoAsync(`${context}/specularColorTexture`, properties.specularColorTexture, (texture) => {
                texture.name = `${babylonMaterial.name} (Specular Color)`;
                babylonMaterial.reflectanceTexture = texture;
            }));
        }
        return Promise.all(promises).then(() => { });
    }
}
unregisterGLTFExtension(NAME$i);
registerGLTFExtension(NAME$i, true, (loader) => new KHR_materials_specular(loader));

const NAME$h = "KHR_materials_ior";
/**
 * [Specification](https://github.com/KhronosGroup/glTF/blob/main/extensions/2.0/Khronos/KHR_materials_ior/README.md)
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
class KHR_materials_ior {
    /**
     * @internal
     */
    constructor(loader) {
        /**
         * The name of this extension.
         */
        this.name = NAME$h;
        /**
         * Defines a number that determines the order the extensions are applied.
         */
        this.order = 180;
        this._loader = loader;
        this.enabled = this._loader.isExtensionUsed(NAME$h);
    }
    /** @internal */
    dispose() {
        this._loader = null;
    }
    /**
     * @internal
     */
    loadMaterialPropertiesAsync(context, material, babylonMaterial) {
        return GLTFLoader.LoadExtensionAsync(context, material, this.name, (extensionContext, extension) => {
            const promises = new Array();
            promises.push(this._loader.loadMaterialPropertiesAsync(context, material, babylonMaterial));
            promises.push(this._loadIorPropertiesAsync(extensionContext, extension, babylonMaterial));
            return Promise.all(promises).then(() => { });
        });
    }
    _loadIorPropertiesAsync(context, properties, babylonMaterial) {
        if (!(babylonMaterial instanceof PBRMaterial)) {
            throw new Error(`${context}: Material type not supported`);
        }
        if (properties.ior !== undefined) {
            babylonMaterial.indexOfRefraction = properties.ior;
        }
        else {
            babylonMaterial.indexOfRefraction = KHR_materials_ior._DEFAULT_IOR;
        }
        return Promise.resolve();
    }
}
/**
 * Default ior Value from the spec.
 */
KHR_materials_ior._DEFAULT_IOR = 1.5;
unregisterGLTFExtension(NAME$h);
registerGLTFExtension(NAME$h, true, (loader) => new KHR_materials_ior(loader));

const NAME$g = "KHR_materials_variants";
/**
 * [Specification](https://github.com/KhronosGroup/glTF/blob/main/extensions/2.0/Khronos/KHR_materials_variants/README.md)
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
class KHR_materials_variants {
    /**
     * @internal
     */
    constructor(loader) {
        /**
         * The name of this extension.
         */
        this.name = NAME$g;
        this._loader = loader;
        this.enabled = this._loader.isExtensionUsed(NAME$g);
    }
    /** @internal */
    dispose() {
        this._loader = null;
    }
    /**
     * Gets the list of available variant names for this asset.
     * @param rootNode The glTF root node
     * @returns the list of all the variant names for this model
     */
    static GetAvailableVariants(rootNode) {
        const extensionMetadata = this._GetExtensionMetadata(rootNode);
        if (!extensionMetadata) {
            return [];
        }
        return Object.keys(extensionMetadata.variants);
    }
    /**
     * Gets the list of available variant names for this asset.
     * @param rootNode The glTF root node
     * @returns the list of all the variant names for this model
     */
    getAvailableVariants(rootNode) {
        return KHR_materials_variants.GetAvailableVariants(rootNode);
    }
    /**
     * Select a variant given a variant name or a list of variant names.
     * @param rootNode The glTF root node
     * @param variantName The variant name(s) to select.
     */
    static SelectVariant(rootNode, variantName) {
        const extensionMetadata = this._GetExtensionMetadata(rootNode);
        if (!extensionMetadata) {
            throw new Error(`Cannot select variant on a glTF mesh that does not have the ${NAME$g} extension`);
        }
        const select = (variantName) => {
            const entries = extensionMetadata.variants[variantName];
            if (entries) {
                for (const entry of entries) {
                    entry.mesh.material = entry.material;
                }
            }
        };
        if (variantName instanceof Array) {
            for (const name of variantName) {
                select(name);
            }
        }
        else {
            select(variantName);
        }
        extensionMetadata.lastSelected = variantName;
    }
    /**
     * Select a variant given a variant name or a list of variant names.
     * @param rootNode The glTF root node
     * @param variantName The variant name(s) to select.
     */
    selectVariant(rootNode, variantName) {
        KHR_materials_variants.SelectVariant(rootNode, variantName);
    }
    /**
     * Reset back to the original before selecting a variant.
     * @param rootNode The glTF root node
     */
    static Reset(rootNode) {
        const extensionMetadata = this._GetExtensionMetadata(rootNode);
        if (!extensionMetadata) {
            throw new Error(`Cannot reset on a glTF mesh that does not have the ${NAME$g} extension`);
        }
        for (const entry of extensionMetadata.original) {
            entry.mesh.material = entry.material;
        }
        extensionMetadata.lastSelected = null;
    }
    /**
     * Reset back to the original before selecting a variant.
     * @param rootNode The glTF root node
     */
    reset(rootNode) {
        KHR_materials_variants.Reset(rootNode);
    }
    /**
     * Gets the last selected variant name(s) or null if original.
     * @param rootNode The glTF root node
     * @returns The selected variant name(s).
     */
    static GetLastSelectedVariant(rootNode) {
        const extensionMetadata = this._GetExtensionMetadata(rootNode);
        if (!extensionMetadata) {
            throw new Error(`Cannot get the last selected variant on a glTF mesh that does not have the ${NAME$g} extension`);
        }
        return extensionMetadata.lastSelected;
    }
    /**
     * Gets the last selected variant name(s) or null if original.
     * @param rootNode The glTF root node
     * @returns The selected variant name(s).
     */
    getLastSelectedVariant(rootNode) {
        return KHR_materials_variants.GetLastSelectedVariant(rootNode);
    }
    static _GetExtensionMetadata(rootNode) {
        return rootNode?._internalMetadata?.gltf?.[NAME$g] || null;
    }
    /** @internal */
    onLoading() {
        const extensions = this._loader.gltf.extensions;
        if (extensions && extensions[this.name]) {
            const extension = extensions[this.name];
            this._variants = extension.variants;
        }
    }
    /** @internal */
    onReady() {
        const rootNode = this._loader.rootBabylonMesh;
        if (rootNode) {
            this._loader.parent.extensionOptions[NAME$g]?.onLoaded?.({
                get variants() {
                    return KHR_materials_variants.GetAvailableVariants(rootNode);
                },
                get selectedVariant() {
                    const lastSelectedVariant = KHR_materials_variants.GetLastSelectedVariant(rootNode);
                    if (!lastSelectedVariant) {
                        return KHR_materials_variants.GetAvailableVariants(rootNode)[0];
                    }
                    if (Array.isArray(lastSelectedVariant)) {
                        return lastSelectedVariant[0];
                    }
                    return lastSelectedVariant;
                },
                set selectedVariant(variantName) {
                    KHR_materials_variants.SelectVariant(rootNode, variantName);
                },
            });
        }
    }
    /**
     * @internal
     */
    _loadMeshPrimitiveAsync(context, name, node, mesh, primitive, assign) {
        return GLTFLoader.LoadExtensionAsync(context, primitive, this.name, (extensionContext, extension) => {
            const promises = new Array();
            promises.push(this._loader._loadMeshPrimitiveAsync(context, name, node, mesh, primitive, (babylonMesh) => {
                assign(babylonMesh);
                if (babylonMesh instanceof Mesh) {
                    const babylonDrawMode = GLTFLoader._GetDrawMode(context, primitive.mode);
                    const root = this._loader.rootBabylonMesh;
                    const metadata = root ? (root._internalMetadata = root._internalMetadata || {}) : {};
                    const gltf = (metadata.gltf = metadata.gltf || {});
                    const extensionMetadata = (gltf[NAME$g] = gltf[NAME$g] || { lastSelected: null, original: [], variants: {} });
                    // Store the original material.
                    extensionMetadata.original.push({ mesh: babylonMesh, material: babylonMesh.material });
                    // For each mapping, look at the variants and make a new entry for them.
                    for (let mappingIndex = 0; mappingIndex < extension.mappings.length; ++mappingIndex) {
                        const mapping = extension.mappings[mappingIndex];
                        const material = ArrayItem.Get(`${extensionContext}/mappings/${mappingIndex}/material`, this._loader.gltf.materials, mapping.material);
                        promises.push(this._loader._loadMaterialAsync(`#/materials/${mapping.material}`, material, babylonMesh, babylonDrawMode, (babylonMaterial) => {
                            for (let mappingVariantIndex = 0; mappingVariantIndex < mapping.variants.length; ++mappingVariantIndex) {
                                const variantIndex = mapping.variants[mappingVariantIndex];
                                const variant = ArrayItem.Get(`/extensions/${NAME$g}/variants/${variantIndex}`, this._variants, variantIndex);
                                extensionMetadata.variants[variant.name] = extensionMetadata.variants[variant.name] || [];
                                extensionMetadata.variants[variant.name].push({
                                    mesh: babylonMesh,
                                    material: babylonMaterial,
                                });
                                // Replace the target when original mesh is cloned
                                babylonMesh.onClonedObservable.add((newOne) => {
                                    const newMesh = newOne;
                                    let metadata = null;
                                    let newRoot = newMesh;
                                    // Find root to get medata
                                    do {
                                        newRoot = newRoot.parent;
                                        if (!newRoot) {
                                            return;
                                        }
                                        metadata = KHR_materials_variants._GetExtensionMetadata(newRoot);
                                    } while (metadata === null);
                                    // Need to clone the metadata on the root (first time only)
                                    if (root && metadata === KHR_materials_variants._GetExtensionMetadata(root)) {
                                        // Copy main metadata
                                        newRoot._internalMetadata = {};
                                        for (const key in root._internalMetadata) {
                                            newRoot._internalMetadata[key] = root._internalMetadata[key];
                                        }
                                        // Copy the gltf metadata
                                        newRoot._internalMetadata.gltf = [];
                                        for (const key in root._internalMetadata.gltf) {
                                            newRoot._internalMetadata.gltf[key] = root._internalMetadata.gltf[key];
                                        }
                                        // Duplicate the extension specific metadata
                                        newRoot._internalMetadata.gltf[NAME$g] = { lastSelected: null, original: [], variants: {} };
                                        for (const original of metadata.original) {
                                            newRoot._internalMetadata.gltf[NAME$g].original.push({
                                                mesh: original.mesh,
                                                material: original.material,
                                            });
                                        }
                                        for (const key in metadata.variants) {
                                            if (Object.prototype.hasOwnProperty.call(metadata.variants, key)) {
                                                newRoot._internalMetadata.gltf[NAME$g].variants[key] = [];
                                                for (const variantEntry of metadata.variants[key]) {
                                                    newRoot._internalMetadata.gltf[NAME$g].variants[key].push({
                                                        mesh: variantEntry.mesh,
                                                        material: variantEntry.material,
                                                    });
                                                }
                                            }
                                        }
                                        metadata = newRoot._internalMetadata.gltf[NAME$g];
                                    }
                                    // Relocate
                                    for (const target of metadata.original) {
                                        if (target.mesh === babylonMesh) {
                                            target.mesh = newMesh;
                                        }
                                    }
                                    for (const target of metadata.variants[variant.name]) {
                                        if (target.mesh === babylonMesh) {
                                            target.mesh = newMesh;
                                        }
                                    }
                                });
                            }
                        }));
                    }
                }
            }));
            return Promise.all(promises).then(([babylonMesh]) => {
                return babylonMesh;
            });
        });
    }
}
unregisterGLTFExtension(NAME$g);
registerGLTFExtension(NAME$g, true, (loader) => new KHR_materials_variants(loader));

/**
 * A class to handle setting up the rendering of opaque objects to be shown through transmissive objects.
 */
class TransmissionHelper {
    /**
     * Creates the default options for the helper.
     * @returns the default options
     */
    static _GetDefaultOptions() {
        return {
            renderSize: 1024,
            samples: 4,
            lodGenerationScale: 1,
            lodGenerationOffset: -4,
            renderTargetTextureType: Constants.TEXTURETYPE_HALF_FLOAT,
            generateMipmaps: true,
        };
    }
    /**
     * constructor
     * @param options Defines the options we want to customize the helper
     * @param scene The scene to add the material to
     */
    constructor(options, scene) {
        this._opaqueRenderTarget = null;
        this._opaqueMeshesCache = [];
        this._transparentMeshesCache = [];
        this._materialObservers = {};
        this._options = {
            ...TransmissionHelper._GetDefaultOptions(),
            ...options,
        };
        this._scene = scene;
        this._scene._transmissionHelper = this;
        this.onErrorObservable = new Observable();
        this._scene.onDisposeObservable.addOnce(() => {
            this.dispose();
        });
        this._parseScene();
        this._setupRenderTargets();
    }
    /**
     * Updates the background according to the new options
     * @param options
     */
    updateOptions(options) {
        // First check if any options are actually being changed. If not, exit.
        const newValues = Object.keys(options).filter((key) => this._options[key] !== options[key]);
        if (!newValues.length) {
            return;
        }
        const newOptions = {
            ...this._options,
            ...options,
        };
        const oldOptions = this._options;
        this._options = newOptions;
        // If size changes, recreate everything
        if (newOptions.renderSize !== oldOptions.renderSize ||
            newOptions.renderTargetTextureType !== oldOptions.renderTargetTextureType ||
            newOptions.generateMipmaps !== oldOptions.generateMipmaps ||
            !this._opaqueRenderTarget) {
            this._setupRenderTargets();
        }
        else {
            this._opaqueRenderTarget.samples = newOptions.samples;
            this._opaqueRenderTarget.lodGenerationScale = newOptions.lodGenerationScale;
            this._opaqueRenderTarget.lodGenerationOffset = newOptions.lodGenerationOffset;
        }
    }
    /**
     * @returns the opaque render target texture or null if not available.
     */
    getOpaqueTarget() {
        return this._opaqueRenderTarget;
    }
    _shouldRenderAsTransmission(material) {
        if (!material) {
            return false;
        }
        if (material instanceof PBRMaterial && material.subSurface.isRefractionEnabled) {
            return true;
        }
        return false;
    }
    _addMesh(mesh) {
        this._materialObservers[mesh.uniqueId] = mesh.onMaterialChangedObservable.add(this._onMeshMaterialChanged.bind(this));
        // we need to defer the processing because _addMesh may be called as part as an instance mesh creation, in which case some
        // internal properties are not setup yet, like _sourceMesh (needed when doing mesh.material below)
        Tools.SetImmediate(() => {
            if (this._shouldRenderAsTransmission(mesh.material)) {
                mesh.material.refractionTexture = this._opaqueRenderTarget;
                if (this._transparentMeshesCache.indexOf(mesh) === -1) {
                    this._transparentMeshesCache.push(mesh);
                }
            }
            else {
                if (this._opaqueMeshesCache.indexOf(mesh) === -1) {
                    this._opaqueMeshesCache.push(mesh);
                }
            }
        });
    }
    _removeMesh(mesh) {
        mesh.onMaterialChangedObservable.remove(this._materialObservers[mesh.uniqueId]);
        delete this._materialObservers[mesh.uniqueId];
        let idx = this._transparentMeshesCache.indexOf(mesh);
        if (idx !== -1) {
            this._transparentMeshesCache.splice(idx, 1);
        }
        idx = this._opaqueMeshesCache.indexOf(mesh);
        if (idx !== -1) {
            this._opaqueMeshesCache.splice(idx, 1);
        }
    }
    _parseScene() {
        this._scene.meshes.forEach(this._addMesh.bind(this));
        // Listen for when a mesh is added to the scene and add it to our cache lists.
        this._scene.onNewMeshAddedObservable.add(this._addMesh.bind(this));
        // Listen for when a mesh is removed from to the scene and remove it from our cache lists.
        this._scene.onMeshRemovedObservable.add(this._removeMesh.bind(this));
    }
    // When one of the meshes in the scene has its material changed, make sure that it's in the correct cache list.
    _onMeshMaterialChanged(mesh) {
        const transparentIdx = this._transparentMeshesCache.indexOf(mesh);
        const opaqueIdx = this._opaqueMeshesCache.indexOf(mesh);
        // If the material is transparent, make sure that it's added to the transparent list and removed from the opaque list
        const useTransmission = this._shouldRenderAsTransmission(mesh.material);
        if (useTransmission) {
            if (mesh.material instanceof PBRMaterial) {
                mesh.material.subSurface.refractionTexture = this._opaqueRenderTarget;
            }
            if (opaqueIdx !== -1) {
                this._opaqueMeshesCache.splice(opaqueIdx, 1);
                this._transparentMeshesCache.push(mesh);
            }
            else if (transparentIdx === -1) {
                this._transparentMeshesCache.push(mesh);
            }
            // If the material is opaque, make sure that it's added to the opaque list and removed from the transparent list
        }
        else {
            if (transparentIdx !== -1) {
                this._transparentMeshesCache.splice(transparentIdx, 1);
                this._opaqueMeshesCache.push(mesh);
            }
            else if (opaqueIdx === -1) {
                this._opaqueMeshesCache.push(mesh);
            }
        }
    }
    /**
     * @internal
     * Check if the opaque render target has not been disposed and can still be used.
     * @returns
     */
    _isRenderTargetValid() {
        return this._opaqueRenderTarget?.getInternalTexture() !== null;
    }
    /**
     * @internal
     * Setup the render targets according to the specified options.
     */
    _setupRenderTargets() {
        if (this._opaqueRenderTarget) {
            this._opaqueRenderTarget.dispose();
        }
        this._opaqueRenderTarget = new RenderTargetTexture("opaqueSceneTexture", this._options.renderSize, this._scene, this._options.generateMipmaps, undefined, this._options.renderTargetTextureType);
        this._opaqueRenderTarget.ignoreCameraViewport = true;
        this._opaqueRenderTarget.renderList = this._opaqueMeshesCache;
        this._opaqueRenderTarget.clearColor = this._options.clearColor?.clone() ?? this._scene.clearColor.clone();
        this._opaqueRenderTarget.gammaSpace = false;
        this._opaqueRenderTarget.lodGenerationScale = this._options.lodGenerationScale;
        this._opaqueRenderTarget.lodGenerationOffset = this._options.lodGenerationOffset;
        this._opaqueRenderTarget.samples = this._options.samples;
        this._opaqueRenderTarget.renderSprites = true;
        this._opaqueRenderTarget.renderParticles = true;
        let sceneImageProcessingapplyByPostProcess;
        let saveSceneEnvIntensity;
        this._opaqueRenderTarget.onBeforeBindObservable.add((opaqueRenderTarget) => {
            saveSceneEnvIntensity = this._scene.environmentIntensity;
            this._scene.environmentIntensity = 1.0;
            sceneImageProcessingapplyByPostProcess = this._scene.imageProcessingConfiguration.applyByPostProcess;
            if (!this._options.clearColor) {
                this._scene.clearColor.toLinearSpaceToRef(opaqueRenderTarget.clearColor, this._scene.getEngine().useExactSrgbConversions);
            }
            else {
                opaqueRenderTarget.clearColor.copyFrom(this._options.clearColor);
            }
            // we do not use the applyByPostProcess setter to avoid flagging all the materials as "image processing dirty"!
            this._scene.imageProcessingConfiguration._applyByPostProcess = true;
        });
        this._opaqueRenderTarget.onAfterUnbindObservable.add(() => {
            this._scene.environmentIntensity = saveSceneEnvIntensity;
            this._scene.imageProcessingConfiguration._applyByPostProcess = sceneImageProcessingapplyByPostProcess;
        });
        this._transparentMeshesCache.forEach((mesh) => {
            if (this._shouldRenderAsTransmission(mesh.material)) {
                mesh.material.refractionTexture = this._opaqueRenderTarget;
            }
        });
    }
    /**
     * Dispose all the elements created by the Helper.
     */
    dispose() {
        this._scene._transmissionHelper = undefined;
        if (this._opaqueRenderTarget) {
            this._opaqueRenderTarget.dispose();
            this._opaqueRenderTarget = null;
        }
        this._transparentMeshesCache = [];
        this._opaqueMeshesCache = [];
    }
}
const NAME$f = "KHR_materials_transmission";
/**
 * [Specification](https://github.com/KhronosGroup/glTF/blob/main/extensions/2.0/Khronos/KHR_materials_transmission/README.md)
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
class KHR_materials_transmission {
    /**
     * @internal
     */
    constructor(loader) {
        /**
         * The name of this extension.
         */
        this.name = NAME$f;
        /**
         * Defines a number that determines the order the extensions are applied.
         */
        this.order = 175;
        this._loader = loader;
        this.enabled = this._loader.isExtensionUsed(NAME$f);
        if (this.enabled) {
            loader.parent.transparencyAsCoverage = true;
        }
    }
    /** @internal */
    dispose() {
        this._loader = null;
    }
    /**
     * @internal
     */
    loadMaterialPropertiesAsync(context, material, babylonMaterial) {
        return GLTFLoader.LoadExtensionAsync(context, material, this.name, (extensionContext, extension) => {
            const promises = new Array();
            promises.push(this._loader.loadMaterialPropertiesAsync(context, material, babylonMaterial));
            promises.push(this._loadTransparentPropertiesAsync(extensionContext, material, babylonMaterial, extension));
            return Promise.all(promises).then(() => { });
        });
    }
    _loadTransparentPropertiesAsync(context, material, babylonMaterial, extension) {
        if (!(babylonMaterial instanceof PBRMaterial)) {
            throw new Error(`${context}: Material type not supported`);
        }
        const pbrMaterial = babylonMaterial;
        // Enables "refraction" texture which represents transmitted light.
        pbrMaterial.subSurface.isRefractionEnabled = true;
        // Since this extension models thin-surface transmission only, we must make IOR = 1.0
        pbrMaterial.subSurface.volumeIndexOfRefraction = 1.0;
        // Albedo colour will tint transmission.
        pbrMaterial.subSurface.useAlbedoToTintRefraction = true;
        if (extension.transmissionFactor !== undefined) {
            pbrMaterial.subSurface.refractionIntensity = extension.transmissionFactor;
            const scene = pbrMaterial.getScene();
            if (pbrMaterial.subSurface.refractionIntensity && !scene._transmissionHelper) {
                new TransmissionHelper({}, pbrMaterial.getScene());
            }
            else if (pbrMaterial.subSurface.refractionIntensity && !scene._transmissionHelper?._isRenderTargetValid()) {
                // If the render target is not valid, recreate it.
                scene._transmissionHelper?._setupRenderTargets();
            }
        }
        else {
            pbrMaterial.subSurface.refractionIntensity = 0.0;
            pbrMaterial.subSurface.isRefractionEnabled = false;
            return Promise.resolve();
        }
        pbrMaterial.subSurface.minimumThickness = 0.0;
        pbrMaterial.subSurface.maximumThickness = 0.0;
        if (extension.transmissionTexture) {
            extension.transmissionTexture.nonColorData = true;
            return this._loader.loadTextureInfoAsync(`${context}/transmissionTexture`, extension.transmissionTexture, undefined).then((texture) => {
                texture.name = `${babylonMaterial.name} (Transmission)`;
                pbrMaterial.subSurface.refractionIntensityTexture = texture;
                pbrMaterial.subSurface.useGltfStyleTextures = true;
            });
        }
        else {
            return Promise.resolve();
        }
    }
}
unregisterGLTFExtension(NAME$f);
registerGLTFExtension(NAME$f, true, (loader) => new KHR_materials_transmission(loader));

const NAME$e = "KHR_materials_diffuse_transmission";
/**
 * [Proposed Specification](https://github.com/KhronosGroup/glTF/pull/1825)
 * !!! Experimental Extension Subject to Changes !!!
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
class KHR_materials_diffuse_transmission {
    /**
     * @internal
     */
    constructor(loader) {
        /**
         * The name of this extension.
         */
        this.name = NAME$e;
        /**
         * Defines a number that determines the order the extensions are applied.
         */
        this.order = 174;
        this._loader = loader;
        this.enabled = this._loader.isExtensionUsed(NAME$e);
        if (this.enabled) {
            loader.parent.transparencyAsCoverage = true;
        }
    }
    /** @internal */
    dispose() {
        this._loader = null;
    }
    /**
     * @internal
     */
    loadMaterialPropertiesAsync(context, material, babylonMaterial) {
        return GLTFLoader.LoadExtensionAsync(context, material, this.name, (extensionContext, extension) => {
            const promises = new Array();
            promises.push(this._loader.loadMaterialPropertiesAsync(context, material, babylonMaterial));
            promises.push(this._loadTranslucentPropertiesAsync(extensionContext, material, babylonMaterial, extension));
            return Promise.all(promises).then(() => { });
        });
    }
    _loadTranslucentPropertiesAsync(context, material, babylonMaterial, extension) {
        if (!(babylonMaterial instanceof PBRMaterial)) {
            throw new Error(`${context}: Material type not supported`);
        }
        const pbrMaterial = babylonMaterial;
        // Enables "translucency" texture which represents diffusely-transmitted light.
        pbrMaterial.subSurface.isTranslucencyEnabled = true;
        // Since this extension models thin-surface transmission only, we must make the
        // internal IOR == 1.0 and set the thickness to 0.
        pbrMaterial.subSurface.volumeIndexOfRefraction = 1.0;
        pbrMaterial.subSurface.minimumThickness = 0.0;
        pbrMaterial.subSurface.maximumThickness = 0.0;
        // Tint color will be used for transmission.
        pbrMaterial.subSurface.useAlbedoToTintTranslucency = false;
        if (extension.diffuseTransmissionFactor !== undefined) {
            pbrMaterial.subSurface.translucencyIntensity = extension.diffuseTransmissionFactor;
        }
        else {
            pbrMaterial.subSurface.translucencyIntensity = 0.0;
            pbrMaterial.subSurface.isTranslucencyEnabled = false;
            return Promise.resolve();
        }
        const promises = new Array();
        pbrMaterial.subSurface.useGltfStyleTextures = true;
        if (extension.diffuseTransmissionTexture) {
            extension.diffuseTransmissionTexture.nonColorData = true;
            promises.push(this._loader.loadTextureInfoAsync(`${context}/diffuseTransmissionTexture`, extension.diffuseTransmissionTexture).then((texture) => {
                texture.name = `${babylonMaterial.name} (Diffuse Transmission)`;
                pbrMaterial.subSurface.translucencyIntensityTexture = texture;
            }));
        }
        if (extension.diffuseTransmissionColorFactor !== undefined) {
            pbrMaterial.subSurface.translucencyColor = Color3.FromArray(extension.diffuseTransmissionColorFactor);
        }
        else {
            pbrMaterial.subSurface.translucencyColor = Color3.White();
        }
        if (extension.diffuseTransmissionColorTexture) {
            promises.push(this._loader.loadTextureInfoAsync(`${context}/diffuseTransmissionColorTexture`, extension.diffuseTransmissionColorTexture).then((texture) => {
                texture.name = `${babylonMaterial.name} (Diffuse Transmission Color)`;
                pbrMaterial.subSurface.translucencyColorTexture = texture;
            }));
        }
        return Promise.all(promises).then(() => { });
    }
}
unregisterGLTFExtension(NAME$e);
registerGLTFExtension(NAME$e, true, (loader) => new KHR_materials_diffuse_transmission(loader));

const NAME$d = "KHR_materials_volume";
/**
 * [Specification](https://github.com/KhronosGroup/glTF/blob/main/extensions/2.0/Khronos/KHR_materials_volume/README.md)
 * @since 5.0.0
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
class KHR_materials_volume {
    /**
     * @internal
     */
    constructor(loader) {
        /**
         * The name of this extension.
         */
        this.name = NAME$d;
        /**
         * Defines a number that determines the order the extensions are applied.
         */
        this.order = 173;
        this._loader = loader;
        this.enabled = this._loader.isExtensionUsed(NAME$d);
        if (this.enabled) {
            // We need to disable instance usage because the attenuation factor depends on the node scale of each individual mesh
            this._loader._disableInstancedMesh++;
        }
    }
    /** @internal */
    dispose() {
        if (this.enabled) {
            this._loader._disableInstancedMesh--;
        }
        this._loader = null;
    }
    /**
     * @internal
     */
    loadMaterialPropertiesAsync(context, material, babylonMaterial) {
        return GLTFLoader.LoadExtensionAsync(context, material, this.name, (extensionContext, extension) => {
            const promises = new Array();
            promises.push(this._loader.loadMaterialPropertiesAsync(context, material, babylonMaterial));
            promises.push(this._loadVolumePropertiesAsync(extensionContext, material, babylonMaterial, extension));
            return Promise.all(promises).then(() => { });
        });
    }
    _loadVolumePropertiesAsync(context, material, babylonMaterial, extension) {
        if (!(babylonMaterial instanceof PBRMaterial)) {
            throw new Error(`${context}: Material type not supported`);
        }
        // If transparency isn't enabled already, this extension shouldn't do anything.
        // i.e. it requires either the KHR_materials_transmission or KHR_materials_diffuse_transmission extensions.
        if ((!babylonMaterial.subSurface.isRefractionEnabled && !babylonMaterial.subSurface.isTranslucencyEnabled) || !extension.thicknessFactor) {
            return Promise.resolve();
        }
        // IOR in this extension only affects interior.
        babylonMaterial.subSurface.volumeIndexOfRefraction = babylonMaterial.indexOfRefraction;
        const attenuationDistance = extension.attenuationDistance !== undefined ? extension.attenuationDistance : Number.MAX_VALUE;
        babylonMaterial.subSurface.tintColorAtDistance = attenuationDistance;
        if (extension.attenuationColor !== undefined && extension.attenuationColor.length == 3) {
            babylonMaterial.subSurface.tintColor.copyFromFloats(extension.attenuationColor[0], extension.attenuationColor[1], extension.attenuationColor[2]);
        }
        babylonMaterial.subSurface.minimumThickness = 0.0;
        babylonMaterial.subSurface.maximumThickness = extension.thicknessFactor;
        babylonMaterial.subSurface.useThicknessAsDepth = true;
        if (extension.thicknessTexture) {
            extension.thicknessTexture.nonColorData = true;
            return this._loader.loadTextureInfoAsync(`${context}/thicknessTexture`, extension.thicknessTexture).then((texture) => {
                texture.name = `${babylonMaterial.name} (Thickness)`;
                babylonMaterial.subSurface.thicknessTexture = texture;
                babylonMaterial.subSurface.useGltfStyleTextures = true;
            });
        }
        else {
            return Promise.resolve();
        }
    }
}
unregisterGLTFExtension(NAME$d);
registerGLTFExtension(NAME$d, true, (loader) => new KHR_materials_volume(loader));

const NAME$c = "KHR_materials_dispersion";
/**
 * [Specification](https://github.com/KhronosGroup/glTF/blob/87bd64a7f5e23c84b6aef2e6082069583ed0ddb4/extensions/2.0/Khronos/KHR_materials_dispersion/README.md)
 * @experimental
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
class KHR_materials_dispersion {
    /**
     * @internal
     */
    constructor(loader) {
        /**
         * The name of this extension.
         */
        this.name = NAME$c;
        /**
         * Defines a number that determines the order the extensions are applied.
         */
        this.order = 174;
        this._loader = loader;
        this.enabled = this._loader.isExtensionUsed(NAME$c);
    }
    /** @internal */
    dispose() {
        this._loader = null;
    }
    /**
     * @internal
     */
    loadMaterialPropertiesAsync(context, material, babylonMaterial) {
        return GLTFLoader.LoadExtensionAsync(context, material, this.name, (extensionContext, extension) => {
            const promises = new Array();
            promises.push(this._loader.loadMaterialPropertiesAsync(context, material, babylonMaterial));
            promises.push(this._loadDispersionPropertiesAsync(extensionContext, material, babylonMaterial, extension));
            return Promise.all(promises).then(() => { });
        });
    }
    _loadDispersionPropertiesAsync(context, material, babylonMaterial, extension) {
        if (!(babylonMaterial instanceof PBRMaterial)) {
            throw new Error(`${context}: Material type not supported`);
        }
        // If transparency isn't enabled already, this extension shouldn't do anything.
        // i.e. it requires either the KHR_materials_transmission or KHR_materials_diffuse_transmission extensions.
        if (!babylonMaterial.subSurface.isRefractionEnabled || !extension.dispersion) {
            return Promise.resolve();
        }
        babylonMaterial.subSurface.isDispersionEnabled = true;
        babylonMaterial.subSurface.dispersion = extension.dispersion;
        return Promise.resolve();
    }
}
unregisterGLTFExtension(NAME$c);
registerGLTFExtension(NAME$c, true, (loader) => new KHR_materials_dispersion(loader));

const NAME$b = "KHR_mesh_quantization";
/**
 * [Specification](https://github.com/KhronosGroup/glTF/blob/main/extensions/2.0/Khronos/KHR_mesh_quantization/README.md)
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
class KHR_mesh_quantization {
    /**
     * @internal
     */
    constructor(loader) {
        /**
         * The name of this extension.
         */
        this.name = NAME$b;
        this.enabled = loader.isExtensionUsed(NAME$b);
    }
    /** @internal */
    dispose() { }
}
unregisterGLTFExtension(NAME$b);
registerGLTFExtension(NAME$b, true, (loader) => new KHR_mesh_quantization(loader));

const NAME$a = "KHR_texture_basisu";
/**
 * [Specification](https://github.com/KhronosGroup/glTF/blob/main/extensions/2.0/Khronos/KHR_texture_basisu/README.md)
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
class KHR_texture_basisu {
    /**
     * @internal
     */
    constructor(loader) {
        /** The name of this extension. */
        this.name = NAME$a;
        this._loader = loader;
        this.enabled = loader.isExtensionUsed(NAME$a);
    }
    /** @internal */
    dispose() {
        this._loader = null;
    }
    /**
     * @internal
     */
    _loadTextureAsync(context, texture, assign) {
        return GLTFLoader.LoadExtensionAsync(context, texture, this.name, (extensionContext, extension) => {
            const sampler = texture.sampler == undefined ? GLTFLoader.DefaultSampler : ArrayItem.Get(`${context}/sampler`, this._loader.gltf.samplers, texture.sampler);
            const image = ArrayItem.Get(`${extensionContext}/source`, this._loader.gltf.images, extension.source);
            return this._loader._createTextureAsync(context, sampler, image, (babylonTexture) => {
                assign(babylonTexture);
            }, texture._textureInfo.nonColorData ? { useRGBAIfASTCBC7NotAvailableWhenUASTC: true } : undefined, !texture._textureInfo.nonColorData);
        });
    }
}
unregisterGLTFExtension(NAME$a);
registerGLTFExtension(NAME$a, true, (loader) => new KHR_texture_basisu(loader));

const NAME$9 = "KHR_texture_transform";
/**
 * [Specification](https://github.com/KhronosGroup/glTF/blob/main/extensions/2.0/Khronos/KHR_texture_transform/README.md)
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
class KHR_texture_transform {
    /**
     * @internal
     */
    constructor(loader) {
        /**
         * The name of this extension.
         */
        this.name = NAME$9;
        this._loader = loader;
        this.enabled = this._loader.isExtensionUsed(NAME$9);
    }
    /** @internal */
    dispose() {
        this._loader = null;
    }
    /**
     * @internal
     */
    loadTextureInfoAsync(context, textureInfo, assign) {
        return GLTFLoader.LoadExtensionAsync(context, textureInfo, this.name, (extensionContext, extension) => {
            return this._loader.loadTextureInfoAsync(context, textureInfo, (babylonTexture) => {
                if (!(babylonTexture instanceof Texture)) {
                    throw new Error(`${extensionContext}: Texture type not supported`);
                }
                if (extension.offset) {
                    babylonTexture.uOffset = extension.offset[0];
                    babylonTexture.vOffset = extension.offset[1];
                }
                // Always rotate around the origin.
                babylonTexture.uRotationCenter = 0;
                babylonTexture.vRotationCenter = 0;
                if (extension.rotation) {
                    babylonTexture.wAng = -extension.rotation;
                }
                if (extension.scale) {
                    babylonTexture.uScale = extension.scale[0];
                    babylonTexture.vScale = extension.scale[1];
                }
                if (extension.texCoord != undefined) {
                    babylonTexture.coordinatesIndex = extension.texCoord;
                }
                assign(babylonTexture);
            });
        });
    }
}
unregisterGLTFExtension(NAME$9);
registerGLTFExtension(NAME$9, true, (loader) => new KHR_texture_transform(loader));

const NAME$8 = "KHR_xmp_json_ld";
/**
 * [Specification](https://github.com/KhronosGroup/glTF/blob/main/extensions/2.0/Khronos/KHR_xmp_json_ld/README.md)
 * @since 5.0.0
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
class KHR_xmp_json_ld {
    /**
     * @internal
     */
    constructor(loader) {
        /**
         * The name of this extension.
         */
        this.name = NAME$8;
        /**
         * Defines a number that determines the order the extensions are applied.
         */
        this.order = 100;
        this._loader = loader;
        this.enabled = this._loader.isExtensionUsed(NAME$8);
    }
    /** @internal */
    dispose() {
        this._loader = null;
    }
    /**
     * Called after the loader state changes to LOADING.
     */
    onLoading() {
        if (this._loader.rootBabylonMesh === null) {
            return;
        }
        const xmp_gltf = this._loader.gltf.extensions?.KHR_xmp_json_ld;
        const xmp_node = this._loader.gltf.asset?.extensions?.KHR_xmp_json_ld;
        if (xmp_gltf && xmp_node) {
            const packet = +xmp_node.packet;
            if (xmp_gltf.packets && packet < xmp_gltf.packets.length) {
                this._loader.rootBabylonMesh.metadata = this._loader.rootBabylonMesh.metadata || {};
                this._loader.rootBabylonMesh.metadata.xmp = xmp_gltf.packets[packet];
            }
        }
    }
}
unregisterGLTFExtension(NAME$8);
registerGLTFExtension(NAME$8, true, (loader) => new KHR_xmp_json_ld(loader));

/* eslint-disable @typescript-eslint/naming-convention */
function getColor3(_target, source, offset, scale) {
    return Color3.FromArray(source, offset).scale(scale);
}
function getAlpha(_target, source, offset, scale) {
    return source[offset + 3] * scale;
}
function getFloat(_target, source, offset, scale) {
    return source[offset] * scale;
}
function getMinusFloat(_target, source, offset, scale) {
    return -source[offset] * scale;
}
function getNextFloat(_target, source, offset, scale) {
    return source[offset + 1] * scale;
}
function getFloatBy2(_target, source, offset, scale) {
    return source[offset] * scale * 2;
}
function getTextureTransformTree(textureName) {
    return {
        scale: [
            new MaterialAnimationPropertyInfo(Animation.ANIMATIONTYPE_FLOAT, `${textureName}.uScale`, getFloat, () => 2),
            new MaterialAnimationPropertyInfo(Animation.ANIMATIONTYPE_FLOAT, `${textureName}.vScale`, getNextFloat, () => 2),
        ],
        offset: [
            new MaterialAnimationPropertyInfo(Animation.ANIMATIONTYPE_FLOAT, `${textureName}.uOffset`, getFloat, () => 2),
            new MaterialAnimationPropertyInfo(Animation.ANIMATIONTYPE_FLOAT, `${textureName}.vOffset`, getNextFloat, () => 2),
        ],
        rotation: [new MaterialAnimationPropertyInfo(Animation.ANIMATIONTYPE_FLOAT, `${textureName}.wAng`, getMinusFloat, () => 1)],
    };
}
class CameraAnimationPropertyInfo extends AnimationPropertyInfo {
    /** @internal */
    buildAnimations(target, name, fps, keys, callback) {
        callback(target._babylonCamera, this._buildAnimation(name, fps, keys));
    }
}
class MaterialAnimationPropertyInfo extends AnimationPropertyInfo {
    /** @internal */
    buildAnimations(target, name, fps, keys, callback) {
        for (const fillMode in target._data) {
            callback(target._data[fillMode].babylonMaterial, this._buildAnimation(name, fps, keys));
        }
    }
}
class LightAnimationPropertyInfo extends AnimationPropertyInfo {
    /** @internal */
    buildAnimations(target, name, fps, keys, callback) {
        callback(target._babylonLight, this._buildAnimation(name, fps, keys));
    }
}
const nodesTree$1 = {
    __array__: {
        __target__: true,
        ...nodeAnimationData,
    },
};
const camerasTree = {
    __array__: {
        __target__: true,
        orthographic: {
            xmag: [
                new CameraAnimationPropertyInfo(Animation.ANIMATIONTYPE_FLOAT, "orthoLeft", getMinusFloat, () => 1),
                new CameraAnimationPropertyInfo(Animation.ANIMATIONTYPE_FLOAT, "orthoRight", getNextFloat, () => 1),
            ],
            ymag: [
                new CameraAnimationPropertyInfo(Animation.ANIMATIONTYPE_FLOAT, "orthoBottom", getMinusFloat, () => 1),
                new CameraAnimationPropertyInfo(Animation.ANIMATIONTYPE_FLOAT, "orthoTop", getNextFloat, () => 1),
            ],
            zfar: [new CameraAnimationPropertyInfo(Animation.ANIMATIONTYPE_FLOAT, "maxZ", getFloat, () => 1)],
            znear: [new CameraAnimationPropertyInfo(Animation.ANIMATIONTYPE_FLOAT, "minZ", getFloat, () => 1)],
        },
        perspective: {
            yfov: [new CameraAnimationPropertyInfo(Animation.ANIMATIONTYPE_FLOAT, "fov", getFloat, () => 1)],
            zfar: [new CameraAnimationPropertyInfo(Animation.ANIMATIONTYPE_FLOAT, "maxZ", getFloat, () => 1)],
            znear: [new CameraAnimationPropertyInfo(Animation.ANIMATIONTYPE_FLOAT, "minZ", getFloat, () => 1)],
        },
    },
};
const materialsTree = {
    __array__: {
        __target__: true,
        pbrMetallicRoughness: {
            baseColorFactor: [
                new MaterialAnimationPropertyInfo(Animation.ANIMATIONTYPE_COLOR3, "albedoColor", getColor3, () => 4),
                new MaterialAnimationPropertyInfo(Animation.ANIMATIONTYPE_FLOAT, "alpha", getAlpha, () => 4),
            ],
            metallicFactor: [new MaterialAnimationPropertyInfo(Animation.ANIMATIONTYPE_FLOAT, "metallic", getFloat, () => 1)],
            roughnessFactor: [new MaterialAnimationPropertyInfo(Animation.ANIMATIONTYPE_FLOAT, "roughness", getFloat, () => 1)],
            baseColorTexture: {
                extensions: {
                    KHR_texture_transform: getTextureTransformTree("albedoTexture"),
                },
            },
            metallicRoughnessTexture: {
                extensions: {
                    KHR_texture_transform: getTextureTransformTree("metallicTexture"),
                },
            },
        },
        emissiveFactor: [new MaterialAnimationPropertyInfo(Animation.ANIMATIONTYPE_COLOR3, "emissiveColor", getColor3, () => 3)],
        normalTexture: {
            scale: [new MaterialAnimationPropertyInfo(Animation.ANIMATIONTYPE_FLOAT, "bumpTexture.level", getFloat, () => 1)],
            extensions: {
                KHR_texture_transform: getTextureTransformTree("bumpTexture"),
            },
        },
        occlusionTexture: {
            strength: [new MaterialAnimationPropertyInfo(Animation.ANIMATIONTYPE_FLOAT, "ambientTextureStrength", getFloat, () => 1)],
            extensions: {
                KHR_texture_transform: getTextureTransformTree("ambientTexture"),
            },
        },
        emissiveTexture: {
            extensions: {
                KHR_texture_transform: getTextureTransformTree("emissiveTexture"),
            },
        },
        extensions: {
            KHR_materials_anisotropy: {
                anisotropyStrength: [new MaterialAnimationPropertyInfo(Animation.ANIMATIONTYPE_FLOAT, "anisotropy.intensity", getFloat, () => 1)],
                anisotropyRotation: [new MaterialAnimationPropertyInfo(Animation.ANIMATIONTYPE_FLOAT, "anisotropy.angle", getFloat, () => 1)],
                anisotropyTexture: {
                    extensions: {
                        KHR_texture_transform: getTextureTransformTree("anisotropy.texture"),
                    },
                },
            },
            KHR_materials_clearcoat: {
                clearcoatFactor: [new MaterialAnimationPropertyInfo(Animation.ANIMATIONTYPE_FLOAT, "clearCoat.intensity", getFloat, () => 1)],
                clearcoatRoughnessFactor: [new MaterialAnimationPropertyInfo(Animation.ANIMATIONTYPE_FLOAT, "clearCoat.roughness", getFloat, () => 1)],
                clearcoatTexture: {
                    extensions: {
                        KHR_texture_transform: getTextureTransformTree("clearCoat.texture"),
                    },
                },
                clearcoatNormalTexture: {
                    scale: [new MaterialAnimationPropertyInfo(Animation.ANIMATIONTYPE_FLOAT, "clearCoat.bumpTexture.level", getFloat, () => 1)],
                    extensions: {
                        KHR_texture_transform: getTextureTransformTree("clearCoat.bumpTexture"),
                    },
                },
                clearcoatRoughnessTexture: {
                    extensions: {
                        KHR_texture_transform: getTextureTransformTree("clearCoat.textureRoughness"),
                    },
                },
            },
            KHR_materials_dispersion: {
                dispersion: [new MaterialAnimationPropertyInfo(Animation.ANIMATIONTYPE_FLOAT, "subSurface.dispersion", getFloat, () => 1)],
            },
            KHR_materials_emissive_strength: {
                emissiveStrength: [new MaterialAnimationPropertyInfo(Animation.ANIMATIONTYPE_FLOAT, "emissiveIntensity", getFloat, () => 1)],
            },
            KHR_materials_ior: {
                ior: [new MaterialAnimationPropertyInfo(Animation.ANIMATIONTYPE_FLOAT, "indexOfRefraction", getFloat, () => 1)],
            },
            KHR_materials_iridescence: {
                iridescenceFactor: [new MaterialAnimationPropertyInfo(Animation.ANIMATIONTYPE_FLOAT, "iridescence.intensity", getFloat, () => 1)],
                iridescenceIor: [new MaterialAnimationPropertyInfo(Animation.ANIMATIONTYPE_FLOAT, "iridescence.indexOfRefraction", getFloat, () => 1)],
                iridescenceThicknessMinimum: [new MaterialAnimationPropertyInfo(Animation.ANIMATIONTYPE_FLOAT, "iridescence.minimumThickness", getFloat, () => 1)],
                iridescenceThicknessMaximum: [new MaterialAnimationPropertyInfo(Animation.ANIMATIONTYPE_FLOAT, "iridescence.maximumThickness", getFloat, () => 1)],
                iridescenceTexture: {
                    extensions: {
                        KHR_texture_transform: getTextureTransformTree("iridescence.texture"),
                    },
                },
                iridescenceThicknessTexture: {
                    extensions: {
                        KHR_texture_transform: getTextureTransformTree("iridescence.thicknessTexture"),
                    },
                },
            },
            KHR_materials_sheen: {
                sheenColorFactor: [new MaterialAnimationPropertyInfo(Animation.ANIMATIONTYPE_COLOR3, "sheen.color", getColor3, () => 3)],
                sheenRoughnessFactor: [new MaterialAnimationPropertyInfo(Animation.ANIMATIONTYPE_FLOAT, "sheen.roughness", getFloat, () => 1)],
                sheenColorTexture: {
                    extensions: {
                        KHR_texture_transform: getTextureTransformTree("sheen.texture"),
                    },
                },
                sheenRoughnessTexture: {
                    extensions: {
                        KHR_texture_transform: getTextureTransformTree("sheen.textureRoughness"),
                    },
                },
            },
            KHR_materials_specular: {
                specularFactor: [new MaterialAnimationPropertyInfo(Animation.ANIMATIONTYPE_FLOAT, "metallicF0Factor", getFloat, () => 1)],
                specularColorFactor: [new MaterialAnimationPropertyInfo(Animation.ANIMATIONTYPE_COLOR3, "metallicReflectanceColor", getColor3, () => 3)],
                specularTexture: {
                    extensions: {
                        KHR_texture_transform: getTextureTransformTree("metallicReflectanceTexture"),
                    },
                },
                specularColorTexture: {
                    extensions: {
                        KHR_texture_transform: getTextureTransformTree("reflectanceTexture"),
                    },
                },
            },
            KHR_materials_transmission: {
                transmissionFactor: [new MaterialAnimationPropertyInfo(Animation.ANIMATIONTYPE_FLOAT, "subSurface.refractionIntensity", getFloat, () => 1)],
                transmissionTexture: {
                    extensions: {
                        KHR_texture_transform: getTextureTransformTree("subSurface.refractionIntensityTexture"),
                    },
                },
            },
            KHR_materials_volume: {
                attenuationColor: [new MaterialAnimationPropertyInfo(Animation.ANIMATIONTYPE_COLOR3, "subSurface.tintColor", getColor3, () => 3)],
                attenuationDistance: [new MaterialAnimationPropertyInfo(Animation.ANIMATIONTYPE_FLOAT, "subSurface.tintColorAtDistance", getFloat, () => 1)],
                thicknessFactor: [new MaterialAnimationPropertyInfo(Animation.ANIMATIONTYPE_FLOAT, "subSurface.maximumThickness", getFloat, () => 1)],
                thicknessTexture: {
                    extensions: {
                        KHR_texture_transform: getTextureTransformTree("subSurface.thicknessTexture"),
                    },
                },
            },
            KHR_materials_diffuse_transmission: {
                diffuseTransmissionFactor: [new MaterialAnimationPropertyInfo(Animation.ANIMATIONTYPE_FLOAT, "subSurface.translucencyIntensity", getFloat, () => 1)],
                diffuseTransmissionTexture: {
                    extensions: {
                        KHR_texture_transform: getTextureTransformTree("subSurface.translucencyIntensityTexture"),
                    },
                },
                diffuseTransmissionColorFactor: [new MaterialAnimationPropertyInfo(Animation.ANIMATIONTYPE_COLOR3, "subSurface.translucencyColor", getColor3, () => 3)],
                diffuseTransmissionColorTexture: {
                    extensions: {
                        KHR_texture_transform: getTextureTransformTree("subSurface.translucencyColorTexture"),
                    },
                },
            },
        },
    },
};
const extensionsTree = {
    KHR_lights_punctual: {
        lights: {
            __array__: {
                __target__: true,
                color: [new LightAnimationPropertyInfo(Animation.ANIMATIONTYPE_COLOR3, "diffuse", getColor3, () => 3)],
                intensity: [new LightAnimationPropertyInfo(Animation.ANIMATIONTYPE_FLOAT, "intensity", getFloat, () => 1)],
                range: [new LightAnimationPropertyInfo(Animation.ANIMATIONTYPE_FLOAT, "range", getFloat, () => 1)],
                spot: {
                    innerConeAngle: [new LightAnimationPropertyInfo(Animation.ANIMATIONTYPE_FLOAT, "innerAngle", getFloatBy2, () => 1)],
                    outerConeAngle: [new LightAnimationPropertyInfo(Animation.ANIMATIONTYPE_FLOAT, "angle", getFloatBy2, () => 1)],
                },
            },
        },
    },
    EXT_lights_ies: {
        lights: {
            __array__: {
                __target__: true,
                color: [new LightAnimationPropertyInfo(Animation.ANIMATIONTYPE_COLOR3, "diffuse", getColor3, () => 3)],
                multiplier: [new LightAnimationPropertyInfo(Animation.ANIMATIONTYPE_FLOAT, "intensity", getFloat, () => 1)],
            },
        },
    },
};
/** @internal */
const animationPointerTree = {
    nodes: nodesTree$1,
    materials: materialsTree,
    cameras: camerasTree,
    extensions: extensionsTree,
};

/**
 * A converter that takes a glTF Object Model JSON Pointer
 * and transforms it into an ObjectAccessorContainer, allowing
 * objects referenced in the glTF to be associated with their
 * respective Babylon.js objects.
 */
class GLTFPathToObjectConverter {
    constructor(_gltf, _infoTree) {
        this._gltf = _gltf;
        this._infoTree = _infoTree;
    }
    /**
     * The pointer string is represented by a [JSON pointer](https://datatracker.ietf.org/doc/html/rfc6901).
     * <animationPointer> := /<rootNode>/<assetIndex>/<propertyPath>
     * <rootNode> := "nodes" | "materials" | "meshes" | "cameras" | "extensions"
     * <assetIndex> := <digit> | <name>
     * <propertyPath> := <extensionPath> | <standardPath>
     * <extensionPath> := "extensions"/<name>/<standardPath>
     * <standardPath> := <name> | <name>/<standardPath>
     * <name> := W+
     * <digit> := D+
     *
     * Examples:
     *  - "/nodes/0/rotation"
     *  - "/materials/2/emissiveFactor"
     *  - "/materials/2/pbrMetallicRoughness/baseColorFactor"
     *  - "/materials/2/extensions/KHR_materials_emissive_strength/emissiveStrength"
     *
     * @param path The path to convert
     * @returns The object and info associated with the path
     */
    convert(path) {
        let objectTree = this._gltf;
        let infoTree = this._infoTree;
        let target = undefined;
        if (!path.startsWith("/")) {
            throw new Error("Path must start with a /");
        }
        const parts = path.split("/");
        parts.shift();
        for (const part of parts) {
            if (infoTree.__array__) {
                infoTree = infoTree.__array__;
            }
            else {
                infoTree = infoTree[part];
                if (!infoTree) {
                    throw new Error(`Path ${path} is invalid`);
                }
            }
            if (objectTree === undefined) {
                throw new Error(`Path ${path} is invalid`);
            }
            objectTree = objectTree[part];
            if (infoTree.__target__) {
                target = objectTree;
            }
        }
        return {
            object: target,
            info: infoTree,
        };
    }
}

const NAME$7 = "KHR_animation_pointer";
/**
 * Class to convert an animation pointer path to a smart object that
 * gets data from the animation buffer and creates animations.
 */
class AnimationPointerPathToObjectConverter extends GLTFPathToObjectConverter {
    constructor(gltf) {
        super(gltf, animationPointerTree);
    }
}
/**
 * [Specification PR](https://github.com/KhronosGroup/glTF/pull/2147)
 * !!! Experimental Extension Subject to Changes !!!
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
class KHR_animation_pointer {
    /**
     * @internal
     */
    constructor(loader) {
        /**
         * The name of this extension.
         */
        this.name = NAME$7;
        this._loader = loader;
        this._pathToObjectConverter = new AnimationPointerPathToObjectConverter(this._loader.gltf);
    }
    /**
     * Defines whether this extension is enabled.
     */
    get enabled() {
        return this._loader.isExtensionUsed(NAME$7);
    }
    /** @internal */
    dispose() {
        this._loader = null;
        delete this._pathToObjectConverter; // GC
    }
    /**
     * Loads a glTF animation channel.
     * @param context The context when loading the asset
     * @param animationContext The context of the animation when loading the asset
     * @param animation The glTF animation property
     * @param channel The glTF animation channel property
     * @param onLoad Called for each animation loaded
     * @returns A void promise that resolves when the load is complete or null if not handled
     */
    _loadAnimationChannelAsync(context, animationContext, animation, channel, onLoad) {
        const extension = channel.target.extensions?.KHR_animation_pointer;
        if (!extension || !this._pathToObjectConverter) {
            return null;
        }
        if (channel.target.path !== "pointer" /* AnimationChannelTargetPath.POINTER */) {
            Logger.Warn(`${context}/target/path: Value (${channel.target.path}) must be (${"pointer" /* AnimationChannelTargetPath.POINTER */}) when using the ${this.name} extension`);
        }
        if (channel.target.node != undefined) {
            Logger.Warn(`${context}/target/node: Value (${channel.target.node}) must not be present when using the ${this.name} extension`);
        }
        const extensionContext = `${context}/extensions/${this.name}`;
        const pointer = extension.pointer;
        if (!pointer) {
            throw new Error(`${extensionContext}: Pointer is missing`);
        }
        try {
            const targetInfo = this._pathToObjectConverter.convert(pointer);
            return this._loader._loadAnimationChannelFromTargetInfoAsync(context, animationContext, animation, channel, targetInfo, onLoad);
        }
        catch (e) {
            Logger.Warn(`${extensionContext}/pointer: Invalid pointer (${pointer}) skipped`);
            return null;
        }
    }
}
unregisterGLTFExtension(NAME$7);
registerGLTFExtension(NAME$7, true, (loader) => new KHR_animation_pointer(loader));

const NAME$6 = "MSFT_audio_emitter";
/**
 * [Specification](https://github.com/najadojo/glTF/blob/MSFT_audio_emitter/extensions/2.0/Vendor/MSFT_audio_emitter/README.md)
 * !!! Experimental Extension Subject to Changes !!!
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
class MSFT_audio_emitter {
    /**
     * @internal
     */
    constructor(loader) {
        /**
         * The name of this extension.
         */
        this.name = NAME$6;
        this._loader = loader;
        this.enabled = this._loader.isExtensionUsed(NAME$6);
    }
    /** @internal */
    dispose() {
        this._loader = null;
        this._clips = null;
        this._emitters = null;
    }
    /** @internal */
    onLoading() {
        const extensions = this._loader.gltf.extensions;
        if (extensions && extensions[this.name]) {
            const extension = extensions[this.name];
            this._clips = extension.clips;
            this._emitters = extension.emitters;
            ArrayItem.Assign(this._clips);
            ArrayItem.Assign(this._emitters);
        }
    }
    /**
     * @internal
     */
    loadSceneAsync(context, scene) {
        return GLTFLoader.LoadExtensionAsync(context, scene, this.name, (extensionContext, extension) => {
            const promises = new Array();
            promises.push(this._loader.loadSceneAsync(context, scene));
            for (const emitterIndex of extension.emitters) {
                const emitter = ArrayItem.Get(`${extensionContext}/emitters`, this._emitters, emitterIndex);
                if (emitter.refDistance != undefined ||
                    emitter.maxDistance != undefined ||
                    emitter.rolloffFactor != undefined ||
                    emitter.distanceModel != undefined ||
                    emitter.innerAngle != undefined ||
                    emitter.outerAngle != undefined) {
                    throw new Error(`${extensionContext}: Direction or Distance properties are not allowed on emitters attached to a scene`);
                }
                promises.push(this._loadEmitterAsync(`${extensionContext}/emitters/${emitter.index}`, emitter));
            }
            return Promise.all(promises).then(() => { });
        });
    }
    /**
     * @internal
     */
    loadNodeAsync(context, node, assign) {
        return GLTFLoader.LoadExtensionAsync(context, node, this.name, (extensionContext, extension) => {
            const promises = new Array();
            return this._loader
                .loadNodeAsync(extensionContext, node, (babylonMesh) => {
                for (const emitterIndex of extension.emitters) {
                    const emitter = ArrayItem.Get(`${extensionContext}/emitters`, this._emitters, emitterIndex);
                    promises.push(this._loadEmitterAsync(`${extensionContext}/emitters/${emitter.index}`, emitter).then(() => {
                        for (const sound of emitter._babylonSounds) {
                            sound.attachToMesh(babylonMesh);
                            if (emitter.innerAngle != undefined || emitter.outerAngle != undefined) {
                                sound.setLocalDirectionToMesh(Vector3.Forward());
                                sound.setDirectionalCone(2 * Tools.ToDegrees(emitter.innerAngle == undefined ? Math.PI : emitter.innerAngle), 2 * Tools.ToDegrees(emitter.outerAngle == undefined ? Math.PI : emitter.outerAngle), 0);
                            }
                        }
                    }));
                }
                assign(babylonMesh);
            })
                .then((babylonMesh) => {
                return Promise.all(promises).then(() => {
                    return babylonMesh;
                });
            });
        });
    }
    /**
     * @internal
     */
    loadAnimationAsync(context, animation) {
        return GLTFLoader.LoadExtensionAsync(context, animation, this.name, (extensionContext, extension) => {
            return this._loader.loadAnimationAsync(context, animation).then((babylonAnimationGroup) => {
                const promises = new Array();
                ArrayItem.Assign(extension.events);
                for (const event of extension.events) {
                    promises.push(this._loadAnimationEventAsync(`${extensionContext}/events/${event.index}`, context, animation, event, babylonAnimationGroup));
                }
                return Promise.all(promises).then(() => {
                    return babylonAnimationGroup;
                });
            });
        });
    }
    _loadClipAsync(context, clip) {
        if (clip._objectURL) {
            return clip._objectURL;
        }
        let promise;
        if (clip.uri) {
            promise = this._loader.loadUriAsync(context, clip, clip.uri);
        }
        else {
            const bufferView = ArrayItem.Get(`${context}/bufferView`, this._loader.gltf.bufferViews, clip.bufferView);
            promise = this._loader.loadBufferViewAsync(`/bufferViews/${bufferView.index}`, bufferView);
        }
        clip._objectURL = promise.then((data) => {
            return URL.createObjectURL(new Blob([data], { type: clip.mimeType }));
        });
        return clip._objectURL;
    }
    _loadEmitterAsync(context, emitter) {
        emitter._babylonSounds = emitter._babylonSounds || [];
        if (!emitter._babylonData) {
            const clipPromises = new Array();
            const name = emitter.name || `emitter${emitter.index}`;
            const options = {
                loop: false,
                autoplay: false,
                volume: emitter.volume == undefined ? 1 : emitter.volume,
            };
            for (let i = 0; i < emitter.clips.length; i++) {
                const clipContext = `/extensions/${this.name}/clips`;
                const clip = ArrayItem.Get(clipContext, this._clips, emitter.clips[i].clip);
                clipPromises.push(this._loadClipAsync(`${clipContext}/${emitter.clips[i].clip}`, clip).then((objectURL) => {
                    const sound = (emitter._babylonSounds[i] = new Sound(name, objectURL, this._loader.babylonScene, null, options));
                    sound.refDistance = emitter.refDistance || 1;
                    sound.maxDistance = emitter.maxDistance || 256;
                    sound.rolloffFactor = emitter.rolloffFactor || 1;
                    sound.distanceModel = emitter.distanceModel || "exponential";
                }));
            }
            const promise = Promise.all(clipPromises).then(() => {
                const weights = emitter.clips.map((clip) => {
                    return clip.weight || 1;
                });
                const weightedSound = new WeightedSound(emitter.loop || false, emitter._babylonSounds, weights);
                if (emitter.innerAngle) {
                    weightedSound.directionalConeInnerAngle = 2 * Tools.ToDegrees(emitter.innerAngle);
                }
                if (emitter.outerAngle) {
                    weightedSound.directionalConeOuterAngle = 2 * Tools.ToDegrees(emitter.outerAngle);
                }
                if (emitter.volume) {
                    weightedSound.volume = emitter.volume;
                }
                emitter._babylonData.sound = weightedSound;
            });
            emitter._babylonData = {
                loaded: promise,
            };
        }
        return emitter._babylonData.loaded;
    }
    _getEventAction(context, sound, action, time, startOffset) {
        switch (action) {
            case "play" /* IMSFTAudioEmitter_AnimationEventAction.play */: {
                return (currentFrame) => {
                    const frameOffset = (startOffset || 0) + (currentFrame - time);
                    sound.play(frameOffset);
                };
            }
            case "stop" /* IMSFTAudioEmitter_AnimationEventAction.stop */: {
                return () => {
                    sound.stop();
                };
            }
            case "pause" /* IMSFTAudioEmitter_AnimationEventAction.pause */: {
                return () => {
                    sound.pause();
                };
            }
            default: {
                throw new Error(`${context}: Unsupported action ${action}`);
            }
        }
    }
    _loadAnimationEventAsync(context, animationContext, animation, event, babylonAnimationGroup) {
        if (babylonAnimationGroup.targetedAnimations.length == 0) {
            return Promise.resolve();
        }
        const babylonAnimation = babylonAnimationGroup.targetedAnimations[0];
        const emitterIndex = event.emitter;
        const emitter = ArrayItem.Get(`/extensions/${this.name}/emitters`, this._emitters, emitterIndex);
        return this._loadEmitterAsync(context, emitter).then(() => {
            const sound = emitter._babylonData.sound;
            if (sound) {
                const babylonAnimationEvent = new AnimationEvent(event.time, this._getEventAction(context, sound, event.action, event.time, event.startOffset));
                babylonAnimation.animation.addEvent(babylonAnimationEvent);
                // Make sure all started audio stops when this animation is terminated.
                babylonAnimationGroup.onAnimationGroupEndObservable.add(() => {
                    sound.stop();
                });
                babylonAnimationGroup.onAnimationGroupPauseObservable.add(() => {
                    sound.pause();
                });
            }
        });
    }
}
unregisterGLTFExtension(NAME$6);
registerGLTFExtension(NAME$6, true, (loader) => new MSFT_audio_emitter(loader));

const NAME$5 = "MSFT_lod";
/**
 * [Specification](https://github.com/KhronosGroup/glTF/blob/main/extensions/2.0/Vendor/MSFT_lod/README.md)
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
class MSFT_lod {
    /**
     * @internal
     */
    constructor(loader) {
        /**
         * The name of this extension.
         */
        this.name = NAME$5;
        /**
         * Defines a number that determines the order the extensions are applied.
         */
        this.order = 100;
        /**
         * Maximum number of LODs to load, starting from the lowest LOD.
         */
        this.maxLODsToLoad = 10;
        /**
         * Observable raised when all node LODs of one level are loaded.
         * The event data is the index of the loaded LOD starting from zero.
         * Dispose the loader to cancel the loading of the next level of LODs.
         */
        this.onNodeLODsLoadedObservable = new Observable();
        /**
         * Observable raised when all material LODs of one level are loaded.
         * The event data is the index of the loaded LOD starting from zero.
         * Dispose the loader to cancel the loading of the next level of LODs.
         */
        this.onMaterialLODsLoadedObservable = new Observable();
        this._bufferLODs = new Array();
        this._nodeIndexLOD = null;
        this._nodeSignalLODs = new Array();
        this._nodePromiseLODs = new Array();
        this._nodeBufferLODs = new Array();
        this._materialIndexLOD = null;
        this._materialSignalLODs = new Array();
        this._materialPromiseLODs = new Array();
        this._materialBufferLODs = new Array();
        this._loader = loader;
        // Options takes precedence. The maxLODsToLoad extension property is retained for back compat.
        // For new extensions, they should only use options.
        this.maxLODsToLoad = this._loader.parent.extensionOptions[NAME$5]?.maxLODsToLoad ?? this.maxLODsToLoad;
        this.enabled = this._loader.isExtensionUsed(NAME$5);
    }
    /** @internal */
    dispose() {
        this._loader = null;
        this._nodeIndexLOD = null;
        this._nodeSignalLODs.length = 0;
        this._nodePromiseLODs.length = 0;
        this._nodeBufferLODs.length = 0;
        this._materialIndexLOD = null;
        this._materialSignalLODs.length = 0;
        this._materialPromiseLODs.length = 0;
        this._materialBufferLODs.length = 0;
        this.onMaterialLODsLoadedObservable.clear();
        this.onNodeLODsLoadedObservable.clear();
    }
    /** @internal */
    onReady() {
        for (let indexLOD = 0; indexLOD < this._nodePromiseLODs.length; indexLOD++) {
            const promise = Promise.all(this._nodePromiseLODs[indexLOD]).then(() => {
                if (indexLOD !== 0) {
                    this._loader.endPerformanceCounter(`Node LOD ${indexLOD}`);
                    this._loader.log(`Loaded node LOD ${indexLOD}`);
                }
                this.onNodeLODsLoadedObservable.notifyObservers(indexLOD);
                if (indexLOD !== this._nodePromiseLODs.length - 1) {
                    this._loader.startPerformanceCounter(`Node LOD ${indexLOD + 1}`);
                    this._loadBufferLOD(this._nodeBufferLODs, indexLOD + 1);
                    if (this._nodeSignalLODs[indexLOD]) {
                        this._nodeSignalLODs[indexLOD].resolve();
                    }
                }
            });
            this._loader._completePromises.push(promise);
        }
        for (let indexLOD = 0; indexLOD < this._materialPromiseLODs.length; indexLOD++) {
            const promise = Promise.all(this._materialPromiseLODs[indexLOD]).then(() => {
                if (indexLOD !== 0) {
                    this._loader.endPerformanceCounter(`Material LOD ${indexLOD}`);
                    this._loader.log(`Loaded material LOD ${indexLOD}`);
                }
                this.onMaterialLODsLoadedObservable.notifyObservers(indexLOD);
                if (indexLOD !== this._materialPromiseLODs.length - 1) {
                    this._loader.startPerformanceCounter(`Material LOD ${indexLOD + 1}`);
                    this._loadBufferLOD(this._materialBufferLODs, indexLOD + 1);
                    if (this._materialSignalLODs[indexLOD]) {
                        this._materialSignalLODs[indexLOD].resolve();
                    }
                }
            });
            this._loader._completePromises.push(promise);
        }
    }
    /**
     * @internal
     */
    loadSceneAsync(context, scene) {
        const promise = this._loader.loadSceneAsync(context, scene);
        this._loadBufferLOD(this._bufferLODs, 0);
        return promise;
    }
    /**
     * @internal
     */
    loadNodeAsync(context, node, assign) {
        return GLTFLoader.LoadExtensionAsync(context, node, this.name, (extensionContext, extension) => {
            let firstPromise;
            const nodeLODs = this._getLODs(extensionContext, node, this._loader.gltf.nodes, extension.ids);
            this._loader.logOpen(`${extensionContext}`);
            for (let indexLOD = 0; indexLOD < nodeLODs.length; indexLOD++) {
                const nodeLOD = nodeLODs[indexLOD];
                if (indexLOD !== 0) {
                    this._nodeIndexLOD = indexLOD;
                    this._nodeSignalLODs[indexLOD] = this._nodeSignalLODs[indexLOD] || new Deferred();
                }
                const assignWrap = (babylonTransformNode) => {
                    assign(babylonTransformNode);
                    babylonTransformNode.setEnabled(false);
                };
                const promise = this._loader.loadNodeAsync(`/nodes/${nodeLOD.index}`, nodeLOD, assignWrap).then((babylonMesh) => {
                    if (indexLOD !== 0) {
                        // TODO: should not rely on _babylonTransformNode
                        const previousNodeLOD = nodeLODs[indexLOD - 1];
                        if (previousNodeLOD._babylonTransformNode) {
                            this._disposeTransformNode(previousNodeLOD._babylonTransformNode);
                            delete previousNodeLOD._babylonTransformNode;
                        }
                    }
                    babylonMesh.setEnabled(true);
                    return babylonMesh;
                });
                this._nodePromiseLODs[indexLOD] = this._nodePromiseLODs[indexLOD] || [];
                if (indexLOD === 0) {
                    firstPromise = promise;
                }
                else {
                    this._nodeIndexLOD = null;
                    this._nodePromiseLODs[indexLOD].push(promise);
                }
            }
            this._loader.logClose();
            return firstPromise;
        });
    }
    /**
     * @internal
     */
    _loadMaterialAsync(context, material, babylonMesh, babylonDrawMode, assign) {
        // Don't load material LODs if already loading a node LOD.
        if (this._nodeIndexLOD) {
            return null;
        }
        return GLTFLoader.LoadExtensionAsync(context, material, this.name, (extensionContext, extension) => {
            let firstPromise;
            const materialLODs = this._getLODs(extensionContext, material, this._loader.gltf.materials, extension.ids);
            this._loader.logOpen(`${extensionContext}`);
            for (let indexLOD = 0; indexLOD < materialLODs.length; indexLOD++) {
                const materialLOD = materialLODs[indexLOD];
                if (indexLOD !== 0) {
                    this._materialIndexLOD = indexLOD;
                }
                const promise = this._loader
                    ._loadMaterialAsync(`/materials/${materialLOD.index}`, materialLOD, babylonMesh, babylonDrawMode, (babylonMaterial) => {
                    if (indexLOD === 0) {
                        assign(babylonMaterial);
                    }
                })
                    .then((babylonMaterial) => {
                    if (indexLOD !== 0) {
                        assign(babylonMaterial);
                        // TODO: should not rely on _data
                        const previousDataLOD = materialLODs[indexLOD - 1]._data;
                        if (previousDataLOD[babylonDrawMode]) {
                            this._disposeMaterials([previousDataLOD[babylonDrawMode].babylonMaterial]);
                            delete previousDataLOD[babylonDrawMode];
                        }
                    }
                    return babylonMaterial;
                });
                this._materialPromiseLODs[indexLOD] = this._materialPromiseLODs[indexLOD] || [];
                if (indexLOD === 0) {
                    firstPromise = promise;
                }
                else {
                    this._materialIndexLOD = null;
                    this._materialPromiseLODs[indexLOD].push(promise);
                }
            }
            this._loader.logClose();
            return firstPromise;
        });
    }
    /**
     * @internal
     */
    _loadUriAsync(context, property, uri) {
        // Defer the loading of uris if loading a node or material LOD.
        if (this._nodeIndexLOD !== null) {
            this._loader.log(`deferred`);
            const previousIndexLOD = this._nodeIndexLOD - 1;
            this._nodeSignalLODs[previousIndexLOD] = this._nodeSignalLODs[previousIndexLOD] || new Deferred();
            return this._nodeSignalLODs[this._nodeIndexLOD - 1].promise.then(() => {
                return this._loader.loadUriAsync(context, property, uri);
            });
        }
        else if (this._materialIndexLOD !== null) {
            this._loader.log(`deferred`);
            const previousIndexLOD = this._materialIndexLOD - 1;
            this._materialSignalLODs[previousIndexLOD] = this._materialSignalLODs[previousIndexLOD] || new Deferred();
            return this._materialSignalLODs[previousIndexLOD].promise.then(() => {
                return this._loader.loadUriAsync(context, property, uri);
            });
        }
        return null;
    }
    /**
     * @internal
     */
    loadBufferAsync(context, buffer, byteOffset, byteLength) {
        if (this._loader.parent.useRangeRequests && !buffer.uri) {
            if (!this._loader.bin) {
                throw new Error(`${context}: Uri is missing or the binary glTF is missing its binary chunk`);
            }
            const loadAsync = (bufferLODs, indexLOD) => {
                const start = byteOffset;
                const end = start + byteLength - 1;
                let bufferLOD = bufferLODs[indexLOD];
                if (bufferLOD) {
                    bufferLOD.start = Math.min(bufferLOD.start, start);
                    bufferLOD.end = Math.max(bufferLOD.end, end);
                }
                else {
                    bufferLOD = { start: start, end: end, loaded: new Deferred() };
                    bufferLODs[indexLOD] = bufferLOD;
                }
                return bufferLOD.loaded.promise.then((data) => {
                    return new Uint8Array(data.buffer, data.byteOffset + byteOffset - bufferLOD.start, byteLength);
                });
            };
            this._loader.log(`deferred`);
            if (this._nodeIndexLOD !== null) {
                return loadAsync(this._nodeBufferLODs, this._nodeIndexLOD);
            }
            else if (this._materialIndexLOD !== null) {
                return loadAsync(this._materialBufferLODs, this._materialIndexLOD);
            }
            else {
                return loadAsync(this._bufferLODs, 0);
            }
        }
        return null;
    }
    _loadBufferLOD(bufferLODs, indexLOD) {
        const bufferLOD = bufferLODs[indexLOD];
        if (bufferLOD) {
            this._loader.log(`Loading buffer range [${bufferLOD.start}-${bufferLOD.end}]`);
            this._loader.bin.readAsync(bufferLOD.start, bufferLOD.end - bufferLOD.start + 1).then((data) => {
                bufferLOD.loaded.resolve(data);
            }, (error) => {
                bufferLOD.loaded.reject(error);
            });
        }
    }
    /**
     * @returns an array of LOD properties from lowest to highest.
     * @param context
     * @param property
     * @param array
     * @param ids
     */
    _getLODs(context, property, array, ids) {
        if (this.maxLODsToLoad <= 0) {
            throw new Error("maxLODsToLoad must be greater than zero");
        }
        const properties = [];
        for (let i = ids.length - 1; i >= 0; i--) {
            properties.push(ArrayItem.Get(`${context}/ids/${ids[i]}`, array, ids[i]));
            if (properties.length === this.maxLODsToLoad) {
                return properties;
            }
        }
        properties.push(property);
        return properties;
    }
    _disposeTransformNode(babylonTransformNode) {
        const babylonMaterials = [];
        const babylonMaterial = babylonTransformNode.material;
        if (babylonMaterial) {
            babylonMaterials.push(babylonMaterial);
        }
        for (const babylonMesh of babylonTransformNode.getChildMeshes()) {
            if (babylonMesh.material) {
                babylonMaterials.push(babylonMesh.material);
            }
        }
        babylonTransformNode.dispose();
        const babylonMaterialsToDispose = babylonMaterials.filter((babylonMaterial) => this._loader.babylonScene.meshes.every((mesh) => mesh.material != babylonMaterial));
        this._disposeMaterials(babylonMaterialsToDispose);
    }
    _disposeMaterials(babylonMaterials) {
        const babylonTextures = {};
        for (const babylonMaterial of babylonMaterials) {
            for (const babylonTexture of babylonMaterial.getActiveTextures()) {
                babylonTextures[babylonTexture.uniqueId] = babylonTexture;
            }
            babylonMaterial.dispose();
        }
        for (const uniqueId in babylonTextures) {
            for (const babylonMaterial of this._loader.babylonScene.materials) {
                if (babylonMaterial.hasTexture(babylonTextures[uniqueId])) {
                    delete babylonTextures[uniqueId];
                }
            }
        }
        for (const uniqueId in babylonTextures) {
            babylonTextures[uniqueId].dispose();
        }
    }
}
unregisterGLTFExtension(NAME$5);
registerGLTFExtension(NAME$5, true, (loader) => new MSFT_lod(loader));

const NAME$4 = "MSFT_minecraftMesh";
/** @internal */
// eslint-disable-next-line @typescript-eslint/naming-convention
class MSFT_minecraftMesh {
    /** @internal */
    constructor(loader) {
        /** @internal */
        this.name = NAME$4;
        this._loader = loader;
        this.enabled = this._loader.isExtensionUsed(NAME$4);
    }
    /** @internal */
    dispose() {
        this._loader = null;
    }
    /** @internal */
    loadMaterialPropertiesAsync(context, material, babylonMaterial) {
        return GLTFLoader.LoadExtraAsync(context, material, this.name, (extraContext, extra) => {
            if (extra) {
                if (!(babylonMaterial instanceof PBRMaterial)) {
                    throw new Error(`${extraContext}: Material type not supported`);
                }
                const promise = this._loader.loadMaterialPropertiesAsync(context, material, babylonMaterial);
                if (babylonMaterial.needAlphaBlending()) {
                    babylonMaterial.forceDepthWrite = true;
                    babylonMaterial.separateCullingPass = true;
                }
                babylonMaterial.backFaceCulling = babylonMaterial.forceDepthWrite;
                babylonMaterial.twoSidedLighting = true;
                return promise;
            }
            return null;
        });
    }
}
unregisterGLTFExtension(NAME$4);
registerGLTFExtension(NAME$4, true, (loader) => new MSFT_minecraftMesh(loader));

const NAME$3 = "MSFT_sRGBFactors";
/** @internal */
// eslint-disable-next-line @typescript-eslint/naming-convention
class MSFT_sRGBFactors {
    /** @internal */
    constructor(loader) {
        /** @internal */
        this.name = NAME$3;
        this._loader = loader;
        this.enabled = this._loader.isExtensionUsed(NAME$3);
    }
    /** @internal */
    dispose() {
        this._loader = null;
    }
    /** @internal */
    loadMaterialPropertiesAsync(context, material, babylonMaterial) {
        return GLTFLoader.LoadExtraAsync(context, material, this.name, (extraContext, extra) => {
            if (extra) {
                if (!(babylonMaterial instanceof PBRMaterial)) {
                    throw new Error(`${extraContext}: Material type not supported`);
                }
                const promise = this._loader.loadMaterialPropertiesAsync(context, material, babylonMaterial);
                const useExactSrgbConversions = babylonMaterial.getScene().getEngine().useExactSrgbConversions;
                if (!babylonMaterial.albedoTexture) {
                    babylonMaterial.albedoColor.toLinearSpaceToRef(babylonMaterial.albedoColor, useExactSrgbConversions);
                }
                if (!babylonMaterial.reflectivityTexture) {
                    babylonMaterial.reflectivityColor.toLinearSpaceToRef(babylonMaterial.reflectivityColor, useExactSrgbConversions);
                }
                return promise;
            }
            return null;
        });
    }
}
unregisterGLTFExtension(NAME$3);
registerGLTFExtension(NAME$3, true, (loader) => new MSFT_sRGBFactors(loader));

/* eslint-disable @typescript-eslint/naming-convention */
const gltfToFlowGraphTypeMap = {
    "lifecycle/onStart": FlowGraphSceneReadyEventBlock.ClassName,
    "lifecycle/onTick": FlowGraphSceneTickEventBlock.ClassName,
    log: FlowGraphConsoleLogBlock.ClassName,
    "flow/delay": FlowGraphTimerBlock.ClassName,
    "customEvent/send": FlowGraphSendCustomEventBlock.ClassName,
    "customEvent/receive": FlowGraphReceiveCustomEventBlock.ClassName,
    "flow/sequence": FlowGraphSequenceBlock.ClassName,
    "world/get": FlowGraphGetPropertyBlock.ClassName,
    "world/set": FlowGraphSetPropertyBlock.ClassName,
    "flow/doN": FlowGraphDoNBlock.ClassName,
    "variable/get": FlowGraphGetVariableBlock.ClassName,
    "variable/set": FlowGraphSetVariableBlock.ClassName,
    "flow/whileLoop": FlowGraphWhileLoopBlock.ClassName,
    "math/random": FlowGraphRandomBlock.ClassName,
    "math/e": FlowGraphEBlock.ClassName,
    "math/pi": FlowGraphPiBlock.ClassName,
    "math/inf": FlowGraphInfBlock.ClassName,
    "math/nan": FlowGraphNaNBlock.ClassName,
    "math/abs": FlowGraphAbsBlock.ClassName,
    "math/sign": FlowGraphSignBlock.ClassName,
    "math/trunc": FlowGraphTruncBlock.ClassName,
    "math/floor": FlowGraphFloorBlock.ClassName,
    "math/ceil": FlowGraphCeilBlock.ClassName,
    "math/fract": FlowGraphFractBlock.ClassName,
    "math/neg": FlowGraphNegBlock.ClassName,
    "math/add": FlowGraphAddBlock.ClassName,
    "math/sub": FlowGraphSubtractBlock.ClassName,
    "math/mul": FlowGraphMultiplyBlock.ClassName,
    "math/div": FlowGraphDivideBlock.ClassName,
    "math/rem": FlowGraphRemainderBlock.ClassName,
    "math/min": FlowGraphMinBlock.ClassName,
    "math/max": FlowGraphMaxBlock.ClassName,
    "math/clamp": FlowGraphClampBlock.ClassName,
    "math/saturate": FlowGraphSaturateBlock.ClassName,
    "math/mix": FlowGraphInterpolateBlock.ClassName,
    "math/eq": FlowGraphEqBlock.ClassName,
    "math/lt": FlowGraphLessThanBlock.ClassName,
    "math/le": FlowGraphLessThanOrEqualBlock.ClassName,
    "math/gt": FlowGraphGreaterThanBlock.ClassName,
    "math/ge": FlowGraphGreaterThanOrEqualBlock.ClassName,
    "math/isnan": FlowGraphIsNanBlock.ClassName,
    "math/isinf": FlowGraphIsInfBlock.ClassName,
    "math/rad": FlowGraphDegToRadBlock.ClassName,
    "math/deg": FlowGraphRadToDegBlock.ClassName,
    "math/sin": FlowGraphSinBlock.ClassName,
    "math/cos": FlowGraphCosBlock.ClassName,
    "math/tan": FlowGraphTanBlock.ClassName,
    "math/asin": FlowGraphAsinBlock.ClassName,
    "math/acos": FlowGraphAcosBlock.ClassName,
    "math/atan": FlowGraphAtanBlock.ClassName,
    "math/atan2": FlowGraphAtan2Block.ClassName,
    "math/sinh": FlowGraphSinhBlock.ClassName,
    "math/cosh": FlowGraphCoshBlock.ClassName,
    "math/tanh": FlowGraphTanhBlock.ClassName,
    "math/asinh": FlowGraphAsinhBlock.ClassName,
    "math/acosh": FlowGraphAcoshBlock.ClassName,
    "math/atanh": FlowGraphAtanhBlock.ClassName,
    "math/exp": FlowGraphExpBlock.ClassName,
    "math/log": FlowGraphLogBlock.ClassName,
    "math/log2": FlowGraphLog2Block.ClassName,
    "math/log10": FlowGraphLog10Block.ClassName,
    "math/sqrt": FlowGraphSqrtBlock.ClassName,
    "math/cbrt": FlowGraphCubeRootBlock.ClassName,
    "math/pow": FlowGraphPowBlock.ClassName,
    "math/length": FlowGraphLengthBlock.ClassName,
    "math/normalize": FlowGraphNormalizeBlock.ClassName,
    "math/dot": FlowGraphDotBlock.ClassName,
    "math/cross": FlowGraphCrossBlock.ClassName,
    "math/rotate2d": FlowGraphRotate2DBlock.ClassName,
    "math/rotate3d": FlowGraphRotate3DBlock.ClassName,
    "math/transpose": FlowGraphTransposeBlock.ClassName,
    "math/determinant": FlowGraphDeterminantBlock.ClassName,
    "math/inverse": FlowGraphInvertMatrixBlock.ClassName,
    "math/matmul": FlowGraphMatMulBlock.ClassName,
    "math/not": FlowGraphBitwiseNotBlock.ClassName,
    "math/and": FlowGraphBitwiseAndBlock.ClassName,
    "math/or": FlowGraphBitwiseOrBlock.ClassName,
    "math/xor": FlowGraphBitwiseXorBlock.ClassName,
    "math/asr": FlowGraphBitwiseRightShiftBlock.ClassName,
    "math/lsl": FlowGraphBitwiseLeftShiftBlock.ClassName,
    "math/clz": FlowGraphCountLeadingZerosBlock.ClassName,
    "math/ctz": FlowGraphCountTrailingZerosBlock.ClassName,
    "math/popcnt": FlowGraphCountOneBitsBlock.ClassName,
};
const gltfTypeToBabylonType = {
    float2: "Vector2",
    float3: "Vector3",
    float4: "Vector4",
    float4x4: "Matrix",
    int: "FlowGraphInteger",
};

function convertValueWithType(configObject, definition, context) {
    if (configObject.type !== undefined) {
        // get the type on the gltf definition
        const type = definition.types && definition.types[configObject.type];
        if (!type) {
            throw new Error(`${context}: Unknown type: ${configObject.type}`);
        }
        const signature = type.signature;
        if (!signature) {
            throw new Error(`${context}: Type ${configObject.type} has no signature`);
        }
        const convertedType = gltfTypeToBabylonType[signature];
        return {
            value: configObject.value,
            className: convertedType,
        };
    }
    else {
        return configObject.value;
    }
}
function convertConfiguration(gltfBlock, definition, id) {
    const converted = {};
    const configurationList = gltfBlock.configuration ?? [];
    for (const configObject of configurationList) {
        if (configObject.id === "customEvent") {
            const customEvent = definition.customEvents && definition.customEvents[configObject.value];
            if (!customEvent) {
                throw new Error(`/extensions/KHR_interactivity/nodes/${id}: Unknown custom event: ${configObject.value}`);
            }
            converted.eventId = customEvent.id;
            converted.eventData = customEvent.values.map((v) => v.id);
        }
        else if (configObject.id === "variable") {
            const variable = definition.variables && definition.variables[configObject.value];
            if (!variable) {
                throw new Error(`/extensions/KHR_interactivity/nodes/${id}: Unknown variable: ${configObject.value}`);
            }
            converted.variableName = variable.id;
        }
        else if (configObject.id === "path") {
            // Convert from a GLTF path to a reference to the Babylon.js object
            const pathValue = configObject.value;
            converted.path = pathValue;
        }
        else {
            converted[configObject.id] = convertValueWithType(configObject, definition, `/extensions/KHR_interactivity/nodes/${id}`);
        }
    }
    return converted;
}
function convertBlock(id, gltfBlock, definition) {
    const className = gltfToFlowGraphTypeMap[gltfBlock.type];
    if (!className) {
        throw new Error(`/extensions/KHR_interactivity/nodes/${id}: Unknown block type: ${gltfBlock.type}`);
    }
    const uniqueId = id.toString();
    const config = convertConfiguration(gltfBlock, definition, uniqueId);
    const metadata = gltfBlock.metadata;
    const dataInputs = [];
    const dataOutputs = [];
    const signalInputs = [];
    const signalOutputs = [];
    return {
        className,
        config,
        uniqueId,
        metadata,
        dataInputs,
        dataOutputs,
        signalInputs,
        signalOutputs,
    };
}
/**
 * @internal
 * Converts a glTF Interactivity Extension to a serialized flow graph.
 * @param gltf the interactivity data
 * @returns a serialized flow graph
 */
function convertGLTFToSerializedFlowGraph(gltf) {
    // create an empty serialized context to store the values of the connections
    const context = {
        uniqueId: RandomGUID(),
        _userVariables: {},
        _connectionValues: {},
    };
    const executionContexts = [context];
    // Blocks converted to the flow graph json format
    const flowGraphJsonBlocks = [];
    for (let i = 0; i < gltf.nodes.length; i++) {
        const gltfBlock = gltf.nodes[i];
        const flowGraphJsonBlock = convertBlock(i, gltfBlock, gltf);
        flowGraphJsonBlocks.push(flowGraphJsonBlock);
    }
    // Parse the connections
    for (let i = 0; i < gltf.nodes.length; i++) {
        const gltfBlock = gltf.nodes[i];
        // get the block that was created in the previous step
        const fgBlock = flowGraphJsonBlocks[i];
        const gltfFlows = gltfBlock.flows ?? [];
        // for each output flow of the gltf block
        for (const flow of gltfFlows) {
            const socketOutName = flow.id;
            // create an output connection for the flow graph block
            const socketOut = {
                uniqueId: RandomGUID(),
                name: socketOutName,
                _connectionType: 1 /* FlowGraphConnectionType.Output */, // Output
                connectedPointIds: [],
            };
            fgBlock.signalOutputs.push(socketOut);
            // get the input node of this flow
            const nodeInId = flow.node;
            const nodeInSocketName = flow.socket;
            // find the corresponding flow graph node
            const nodeIn = flowGraphJsonBlocks[nodeInId];
            if (!nodeIn) {
                throw new Error(`/extensions/KHR_interactivity/nodes/${i}: Could not find node with id ${nodeInId} that connects its input with with node ${i}'s output ${socketOutName}`);
            }
            // in all of the flow graph input connections, find the one with the same name as the socket
            let socketIn = nodeIn.signalInputs.find((s) => s.name === nodeInSocketName);
            // if the socket doesn't exist, create the input socket for the connection
            if (!socketIn) {
                socketIn = {
                    uniqueId: RandomGUID(),
                    name: nodeInSocketName,
                    _connectionType: 0 /* FlowGraphConnectionType.Input */, // Input
                    connectedPointIds: [],
                };
                nodeIn.signalInputs.push(socketIn);
            }
            // connect the sockets
            socketIn.connectedPointIds.push(socketOut.uniqueId);
            socketOut.connectedPointIds.push(socketIn.uniqueId);
        }
        // for each input value of the gltf block
        const gltfValues = gltfBlock.values ?? [];
        for (const value of gltfValues) {
            const socketInName = value.id;
            // create an input data connection for the flow graph block
            const socketIn = {
                uniqueId: RandomGUID(),
                name: socketInName,
                _connectionType: 0 /* FlowGraphConnectionType.Input */,
                connectedPointIds: [],
            };
            fgBlock.dataInputs.push(socketIn);
            if (value.value !== undefined) {
                // if the value is set on the socket itself, store it in the context
                const convertedValue = convertValueWithType(value, gltf, `/extensions/KHR_interactivity/nodes/${i}`);
                // convertBlockInputType(gltfBlock, value, convertedValue, `/extensions/KHR_interactivity/nodes/${i}`);
                context._connectionValues[socketIn.uniqueId] = convertedValue;
            }
            else if (value.node !== undefined && value.socket !== undefined) {
                // if the value is connected with the output data of another socket, connect the two
                const nodeOutId = value.node;
                const nodeOutSocketName = value.socket;
                // find the flow graph node that owns that output socket
                const nodeOut = flowGraphJsonBlocks[nodeOutId];
                if (!nodeOut) {
                    throw new Error(`/extensions/KHR_interactivity/nodes/${i}: Could not find node with id ${nodeOutId} that connects its output with node${i}'s input ${socketInName}`);
                }
                let socketOut = nodeOut.dataOutputs.find((s) => s.name === nodeOutSocketName);
                // if the socket doesn't exist, create it
                if (!socketOut) {
                    socketOut = {
                        uniqueId: RandomGUID(),
                        name: nodeOutSocketName,
                        _connectionType: 1 /* FlowGraphConnectionType.Output */,
                        connectedPointIds: [],
                    };
                    nodeOut.dataOutputs.push(socketOut);
                }
                // connect the sockets
                socketIn.connectedPointIds.push(socketOut.uniqueId);
                socketOut.connectedPointIds.push(socketIn.uniqueId);
            }
            else {
                throw new Error(`/extensions/KHR_interactivity/nodes/${i}: Invalid socket ${socketInName} in node ${i}`);
            }
        }
    }
    const variables = gltf.variables ?? [];
    // Parse variables
    for (let i = 0; i < variables.length; i++) {
        const variable = variables[i];
        const variableName = variable.id;
        context._userVariables[variableName] = convertValueWithType(variable, gltf, `/extensions/KHR_interactivity/variables/${i}`);
    }
    return {
        allBlocks: flowGraphJsonBlocks,
        executionContexts,
    };
}

/**
 * Class to convert an interactivity pointer path to a smart object
 */
class InteractivityPathToObjectConverter extends GLTFPathToObjectConverter {
    constructor(gltf) {
        super(gltf, gltfTree);
    }
}
const nodesTree = {
    __array__: {
        __target__: true,
        translation: {
            type: "Vector3",
            get: (node) => {
                const babylonObject = node._babylonTransformNode;
                return babylonObject.position;
            },
            set: (value, node) => {
                const babylonObject = node._babylonTransformNode;
                babylonObject.position = value;
            },
            getObject(node) {
                return node._babylonTransformNode;
            },
        },
    },
};
const gltfTree = {
    nodes: nodesTree,
};

const NAME$2 = "KHR_interactivity";
/**
 * Loader extension for KHR_interactivity
 */
class KHR_interactivity {
    /**
     * @internal
     * @param _loader
     */
    constructor(_loader) {
        this._loader = _loader;
        /**
         * The name of this extension.
         */
        this.name = NAME$2;
        this.enabled = this._loader.isExtensionUsed(NAME$2);
        this._pathConverter = new InteractivityPathToObjectConverter(this._loader.gltf);
    }
    dispose() {
        this._loader = null;
        delete this._pathConverter;
    }
    onReady() {
        if (!this._loader.babylonScene || !this._pathConverter) {
            return;
        }
        const scene = this._loader.babylonScene;
        const interactivityDefinition = this._loader.gltf.extensions?.KHR_interactivity;
        const json = convertGLTFToSerializedFlowGraph(interactivityDefinition);
        const coordinator = new FlowGraphCoordinator({ scene });
        FlowGraph.Parse(json, { coordinator, pathConverter: this._pathConverter });
        coordinator.start();
    }
}
unregisterGLTFExtension(NAME$2);
registerGLTFExtension(NAME$2, true, (loader) => new KHR_interactivity(loader));

const NAME$1 = "KHR_node_visibility";
/**
 * Loader extension for KHR_node_visibility
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
class KHR_node_visibility {
    /**
     * @internal
     */
    constructor(loader) {
        /**
         * The name of this extension.
         */
        this.name = NAME$1;
        this._loader = loader;
        this.enabled = loader.isExtensionUsed(NAME$1);
    }
    async onReady() {
        this._loader.gltf.nodes?.forEach((node) => {
            node._primitiveBabylonMeshes?.forEach((mesh) => {
                mesh.inheritVisibility = true;
            });
            // When the JSON Pointer is used we need to change both the transform node and the primitive meshes to the new value.
            if (node.extensions?.KHR_node_visibility) {
                if (node.extensions?.KHR_node_visibility.visible === false) {
                    if (node._babylonTransformNode) {
                        node._babylonTransformNode.isVisible = false;
                    }
                    node._primitiveBabylonMeshes?.forEach((mesh) => {
                        mesh.isVisible = false;
                    });
                }
            }
        });
    }
    dispose() {
        this._loader = null;
    }
}
unregisterGLTFExtension(NAME$1);
registerGLTFExtension(NAME$1, true, (loader) => new KHR_node_visibility(loader));

const NAME = "ExtrasAsMetadata";
/**
 * Store glTF extras (if present) in BJS objects' metadata
 */
class ExtrasAsMetadata {
    _assignExtras(babylonObject, gltfProp) {
        if (gltfProp.extras && Object.keys(gltfProp.extras).length > 0) {
            const metadata = (babylonObject.metadata = babylonObject.metadata || {});
            const gltf = (metadata.gltf = metadata.gltf || {});
            gltf.extras = gltfProp.extras;
        }
    }
    /**
     * @internal
     */
    constructor(loader) {
        /**
         * The name of this extension.
         */
        this.name = NAME;
        /**
         * Defines whether this extension is enabled.
         */
        this.enabled = true;
        this._loader = loader;
    }
    /** @internal */
    dispose() {
        this._loader = null;
    }
    /**
     * @internal
     */
    loadNodeAsync(context, node, assign) {
        return this._loader.loadNodeAsync(context, node, (babylonTransformNode) => {
            this._assignExtras(babylonTransformNode, node);
            assign(babylonTransformNode);
        });
    }
    /**
     * @internal
     */
    loadCameraAsync(context, camera, assign) {
        return this._loader.loadCameraAsync(context, camera, (babylonCamera) => {
            this._assignExtras(babylonCamera, camera);
            assign(babylonCamera);
        });
    }
    /**
     * @internal
     */
    createMaterial(context, material, babylonDrawMode) {
        const babylonMaterial = this._loader.createMaterial(context, material, babylonDrawMode);
        this._assignExtras(babylonMaterial, material);
        return babylonMaterial;
    }
}
unregisterGLTFExtension(NAME);
registerGLTFExtension(NAME, false, (loader) => new ExtrasAsMetadata(loader));

/* eslint-disable import/no-internal-modules */

var index = /*#__PURE__*/Object.freeze({
    __proto__: null,
    ArrayItem: ArrayItem,
    EXT_lights_ies: EXT_lights_ies,
    EXT_lights_image_based: EXT_lights_image_based,
    EXT_mesh_gpu_instancing: EXT_mesh_gpu_instancing,
    EXT_meshopt_compression: EXT_meshopt_compression,
    EXT_texture_avif: EXT_texture_avif,
    EXT_texture_webp: EXT_texture_webp,
    ExtrasAsMetadata: ExtrasAsMetadata,
    GLTFFileLoader: GLTFFileLoader,
    GLTFLoader: GLTFLoader,
    KHR_animation_pointer: KHR_animation_pointer,
    KHR_draco_mesh_compression: KHR_draco_mesh_compression,
    KHR_interactivity: KHR_interactivity,
    KHR_lights: KHR_lights,
    KHR_materials_anisotropy: KHR_materials_anisotropy,
    KHR_materials_clearcoat: KHR_materials_clearcoat,
    KHR_materials_diffuse_transmission: KHR_materials_diffuse_transmission,
    KHR_materials_dispersion: KHR_materials_dispersion,
    KHR_materials_emissive_strength: KHR_materials_emissive_strength,
    KHR_materials_ior: KHR_materials_ior,
    KHR_materials_iridescence: KHR_materials_iridescence,
    KHR_materials_pbrSpecularGlossiness: KHR_materials_pbrSpecularGlossiness,
    KHR_materials_sheen: KHR_materials_sheen,
    KHR_materials_specular: KHR_materials_specular,
    KHR_materials_transmission: KHR_materials_transmission,
    KHR_materials_unlit: KHR_materials_unlit,
    KHR_materials_variants: KHR_materials_variants,
    KHR_materials_volume: KHR_materials_volume,
    KHR_mesh_quantization: KHR_mesh_quantization,
    KHR_node_visibility: KHR_node_visibility,
    KHR_texture_basisu: KHR_texture_basisu,
    KHR_texture_transform: KHR_texture_transform,
    KHR_xmp_json_ld: KHR_xmp_json_ld,
    LoadBoundingInfoFromPositionAccessor: LoadBoundingInfoFromPositionAccessor,
    MSFT_audio_emitter: MSFT_audio_emitter,
    MSFT_lod: MSFT_lod,
    MSFT_minecraftMesh: MSFT_minecraftMesh,
    MSFT_sRGBFactors: MSFT_sRGBFactors,
    registerGLTFExtension: registerGLTFExtension,
    registeredGLTFExtensions: registeredGLTFExtensions,
    unregisterGLTFExtension: unregisterGLTFExtension
});

/**
 * Class reading and parsing the MTL file bundled with the obj file.
 */
class MTLFileLoader {
    constructor() {
        /**
         * All material loaded from the mtl will be set here
         */
        this.materials = [];
    }
    /**
     * This function will read the mtl file and create each material described inside
     * This function could be improve by adding :
     * -some component missing (Ni, Tf...)
     * -including the specific options available
     *
     * @param scene defines the scene the material will be created in
     * @param data defines the mtl data to parse
     * @param rootUrl defines the rooturl to use in order to load relative dependencies
     * @param assetContainer defines the asset container to store the material in (can be null)
     */
    parseMTL(scene, data, rootUrl, assetContainer) {
        if (data instanceof ArrayBuffer) {
            return;
        }
        //Split the lines from the file
        const lines = data.split("\n");
        // whitespace char ie: [ \t\r\n\f]
        const delimiter_pattern = /\s+/;
        //Array with RGB colors
        let color;
        //New material
        let material = null;
        //Look at each line
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            // Blank line or comment
            if (line.length === 0 || line.charAt(0) === "#") {
                continue;
            }
            //Get the first parameter (keyword)
            const pos = line.indexOf(" ");
            let key = pos >= 0 ? line.substring(0, pos) : line;
            key = key.toLowerCase();
            //Get the data following the key
            const value = pos >= 0 ? line.substring(pos + 1).trim() : "";
            //This mtl keyword will create the new material
            if (key === "newmtl") {
                //Check if it is the first material.
                // Materials specifications are described after this keyword.
                if (material) {
                    //Add the previous material in the material array.
                    this.materials.push(material);
                }
                //Create a new material.
                // value is the name of the material read in the mtl file
                scene._blockEntityCollection = !!assetContainer;
                material = new StandardMaterial(value, scene);
                material._parentContainer = assetContainer;
                scene._blockEntityCollection = false;
            }
            else if (key === "kd" && material) {
                // Diffuse color (color under white light) using RGB values
                //value  = "r g b"
                color = value.split(delimiter_pattern, 3).map(parseFloat);
                //color = [r,g,b]
                //Set tghe color into the material
                material.diffuseColor = Color3.FromArray(color);
            }
            else if (key === "ka" && material) {
                // Ambient color (color under shadow) using RGB values
                //value = "r g b"
                color = value.split(delimiter_pattern, 3).map(parseFloat);
                //color = [r,g,b]
                //Set tghe color into the material
                material.ambientColor = Color3.FromArray(color);
            }
            else if (key === "ks" && material) {
                // Specular color (color when light is reflected from shiny surface) using RGB values
                //value = "r g b"
                color = value.split(delimiter_pattern, 3).map(parseFloat);
                //color = [r,g,b]
                //Set the color into the material
                material.specularColor = Color3.FromArray(color);
            }
            else if (key === "ke" && material) {
                // Emissive color using RGB values
                color = value.split(delimiter_pattern, 3).map(parseFloat);
                material.emissiveColor = Color3.FromArray(color);
            }
            else if (key === "ns" && material) {
                //value = "Integer"
                material.specularPower = parseFloat(value);
            }
            else if (key === "d" && material) {
                //d is dissolve for current material. It mean alpha for BABYLON
                material.alpha = parseFloat(value);
                //Texture
                //This part can be improved by adding the possible options of texture
            }
            else if (key === "map_ka" && material) {
                // ambient texture map with a loaded image
                //We must first get the folder of the image
                material.ambientTexture = MTLFileLoader._GetTexture(rootUrl, value, scene);
            }
            else if (key === "map_kd" && material) {
                // Diffuse texture map with a loaded image
                material.diffuseTexture = MTLFileLoader._GetTexture(rootUrl, value, scene);
            }
            else if (key === "map_ks" && material) {
                // Specular texture map with a loaded image
                //We must first get the folder of the image
                material.specularTexture = MTLFileLoader._GetTexture(rootUrl, value, scene);
            }
            else if (key === "map_ns") ;
            else if (key === "map_bump" && material) {
                //The bump texture
                const values = value.split(delimiter_pattern);
                const bumpMultiplierIndex = values.indexOf("-bm");
                let bumpMultiplier = null;
                if (bumpMultiplierIndex >= 0) {
                    bumpMultiplier = values[bumpMultiplierIndex + 1];
                    values.splice(bumpMultiplierIndex, 2); // remove
                }
                material.bumpTexture = MTLFileLoader._GetTexture(rootUrl, values.join(" "), scene);
                if (material.bumpTexture && bumpMultiplier !== null) {
                    material.bumpTexture.level = parseFloat(bumpMultiplier);
                }
            }
            else if (key === "map_d" && material) {
                // The dissolve of the material
                material.opacityTexture = MTLFileLoader._GetTexture(rootUrl, value, scene);
                //Options for illumination
            }
            else ;
        }
        //At the end of the file, add the last material
        if (material) {
            this.materials.push(material);
        }
    }
    /**
     * Gets the texture for the material.
     *
     * If the material is imported from input file,
     * We sanitize the url to ensure it takes the texture from aside the material.
     *
     * @param rootUrl The root url to load from
     * @param value The value stored in the mtl
     * @param scene
     * @returns The Texture
     */
    static _GetTexture(rootUrl, value, scene) {
        if (!value) {
            return null;
        }
        let url = rootUrl;
        // Load from input file.
        if (rootUrl === "file:") {
            let lastDelimiter = value.lastIndexOf("\\");
            if (lastDelimiter === -1) {
                lastDelimiter = value.lastIndexOf("/");
            }
            if (lastDelimiter > -1) {
                url += value.substring(lastDelimiter + 1);
            }
            else {
                url += value;
            }
        }
        // Not from input file.
        else {
            url += value;
        }
        return new Texture(url, scene, false, MTLFileLoader.INVERT_TEXTURE_Y);
    }
}
/**
 * Invert Y-Axis of referenced textures on load
 */
MTLFileLoader.INVERT_TEXTURE_Y = true;

/**
 * Class used to load mesh data from OBJ content
 */
class SolidParser {
    /**
     * Creates a new SolidParser
     * @param materialToUse defines the array to fill with the list of materials to use (it will be filled by the parse function)
     * @param babylonMeshesArray defines the array to fill with the list of loaded meshes (it will be filled by the parse function)
     * @param loadingOptions defines the loading options to use
     */
    constructor(materialToUse, babylonMeshesArray, loadingOptions) {
        this._positions = []; //values for the positions of vertices
        this._normals = []; //Values for the normals
        this._uvs = []; //Values for the textures
        this._colors = [];
        this._extColors = []; //Extension color
        this._meshesFromObj = []; //[mesh] Contains all the obj meshes
        this._indicesForBabylon = []; //The list of indices for VertexData
        this._wrappedPositionForBabylon = []; //The list of position in vectors
        this._wrappedUvsForBabylon = []; //Array with all value of uvs to match with the indices
        this._wrappedColorsForBabylon = []; // Array with all color values to match with the indices
        this._wrappedNormalsForBabylon = []; //Array with all value of normals to match with the indices
        this._tuplePosNorm = []; //Create a tuple with indice of Position, Normal, UV  [pos, norm, uvs]
        this._curPositionInIndices = 0;
        this._hasMeshes = false; //Meshes are defined in the file
        this._unwrappedPositionsForBabylon = []; //Value of positionForBabylon w/o Vector3() [x,y,z]
        this._unwrappedColorsForBabylon = []; // Value of colorForBabylon w/o Color4() [r,g,b,a]
        this._unwrappedNormalsForBabylon = []; //Value of normalsForBabylon w/o Vector3()  [x,y,z]
        this._unwrappedUVForBabylon = []; //Value of uvsForBabylon w/o Vector3()      [x,y,z]
        this._triangles = []; //Indices from new triangles coming from polygons
        this._materialNameFromObj = ""; //The name of the current material
        this._objMeshName = ""; //The name of the current obj mesh
        this._increment = 1; //Id for meshes created by the multimaterial
        this._isFirstMaterial = true;
        this._grayColor = new Color4(0.5, 0.5, 0.5, 1);
        this._hasLineData = false; //If this mesh has line segment(l) data
        this._materialToUse = materialToUse;
        this._babylonMeshesArray = babylonMeshesArray;
        this._loadingOptions = loadingOptions;
    }
    /**
     * Search for obj in the given array.
     * This function is called to check if a couple of data already exists in an array.
     *
     * If found, returns the index of the founded tuple index. Returns -1 if not found
     * @param arr Array<{ normals: Array<number>, idx: Array<number> }>
     * @param obj Array<number>
     * @returns {boolean}
     */
    _isInArray(arr, obj) {
        if (!arr[obj[0]]) {
            arr[obj[0]] = { normals: [], idx: [] };
        }
        const idx = arr[obj[0]].normals.indexOf(obj[1]);
        return idx === -1 ? -1 : arr[obj[0]].idx[idx];
    }
    _isInArrayUV(arr, obj) {
        if (!arr[obj[0]]) {
            arr[obj[0]] = { normals: [], idx: [], uv: [] };
        }
        const idx = arr[obj[0]].normals.indexOf(obj[1]);
        if (idx != 1 && obj[2] === arr[obj[0]].uv[idx]) {
            return arr[obj[0]].idx[idx];
        }
        return -1;
    }
    /**
     * This function set the data for each triangle.
     * Data are position, normals and uvs
     * If a tuple of (position, normal) is not set, add the data into the corresponding array
     * If the tuple already exist, add only their indice
     *
     * @param indicePositionFromObj Integer The index in positions array
     * @param indiceUvsFromObj Integer The index in uvs array
     * @param indiceNormalFromObj Integer The index in normals array
     * @param positionVectorFromOBJ Vector3 The value of position at index objIndice
     * @param textureVectorFromOBJ Vector3 The value of uvs
     * @param normalsVectorFromOBJ Vector3 The value of normals at index objNormale
     * @param positionColorsFromOBJ
     */
    _setData(indicePositionFromObj, indiceUvsFromObj, indiceNormalFromObj, positionVectorFromOBJ, textureVectorFromOBJ, normalsVectorFromOBJ, positionColorsFromOBJ) {
        //Check if this tuple already exists in the list of tuples
        let _index;
        if (this._loadingOptions.optimizeWithUV) {
            _index = this._isInArrayUV(this._tuplePosNorm, [indicePositionFromObj, indiceNormalFromObj, indiceUvsFromObj]);
        }
        else {
            _index = this._isInArray(this._tuplePosNorm, [indicePositionFromObj, indiceNormalFromObj]);
        }
        //If it not exists
        if (_index === -1) {
            //Add an new indice.
            //The array of indices is only an array with his length equal to the number of triangles - 1.
            //We add vertices data in this order
            this._indicesForBabylon.push(this._wrappedPositionForBabylon.length);
            //Push the position of vertice for Babylon
            //Each element is a Vector3(x,y,z)
            this._wrappedPositionForBabylon.push(positionVectorFromOBJ);
            //Push the uvs for Babylon
            //Each element is a Vector2(u,v)
            //If the UVs are missing, set (u,v)=(0,0)
            textureVectorFromOBJ = textureVectorFromOBJ ?? new Vector2(0, 0);
            this._wrappedUvsForBabylon.push(textureVectorFromOBJ);
            //Push the normals for Babylon
            //Each element is a Vector3(x,y,z)
            this._wrappedNormalsForBabylon.push(normalsVectorFromOBJ);
            if (positionColorsFromOBJ !== undefined) {
                //Push the colors for Babylon
                //Each element is a BABYLON.Color4(r,g,b,a)
                this._wrappedColorsForBabylon.push(positionColorsFromOBJ);
            }
            //Add the tuple in the comparison list
            this._tuplePosNorm[indicePositionFromObj].normals.push(indiceNormalFromObj);
            this._tuplePosNorm[indicePositionFromObj].idx.push(this._curPositionInIndices++);
            if (this._loadingOptions.optimizeWithUV) {
                this._tuplePosNorm[indicePositionFromObj].uv.push(indiceUvsFromObj);
            }
        }
        else {
            //The tuple already exists
            //Add the index of the already existing tuple
            //At this index we can get the value of position, normal, color and uvs of vertex
            this._indicesForBabylon.push(_index);
        }
    }
    /**
     * Transform Vector() and BABYLON.Color() objects into numbers in an array
     */
    _unwrapData() {
        try {
            //Every array has the same length
            for (let l = 0; l < this._wrappedPositionForBabylon.length; l++) {
                //Push the x, y, z values of each element in the unwrapped array
                this._unwrappedPositionsForBabylon.push(this._wrappedPositionForBabylon[l].x * this._handednessSign, this._wrappedPositionForBabylon[l].y, this._wrappedPositionForBabylon[l].z);
                this._unwrappedNormalsForBabylon.push(this._wrappedNormalsForBabylon[l].x * this._handednessSign, this._wrappedNormalsForBabylon[l].y, this._wrappedNormalsForBabylon[l].z);
                this._unwrappedUVForBabylon.push(this._wrappedUvsForBabylon[l].x, this._wrappedUvsForBabylon[l].y); //z is an optional value not supported by BABYLON
                if (this._loadingOptions.importVertexColors) {
                    //Push the r, g, b, a values of each element in the unwrapped array
                    this._unwrappedColorsForBabylon.push(this._wrappedColorsForBabylon[l].r, this._wrappedColorsForBabylon[l].g, this._wrappedColorsForBabylon[l].b, this._wrappedColorsForBabylon[l].a);
                }
            }
            // Reset arrays for the next new meshes
            this._wrappedPositionForBabylon.length = 0;
            this._wrappedNormalsForBabylon.length = 0;
            this._wrappedUvsForBabylon.length = 0;
            this._wrappedColorsForBabylon.length = 0;
            this._tuplePosNorm.length = 0;
            this._curPositionInIndices = 0;
        }
        catch (e) {
            throw new Error("Unable to unwrap data while parsing OBJ data.");
        }
    }
    /**
     * Create triangles from polygons
     * It is important to notice that a triangle is a polygon
     * We get 5 patterns of face defined in OBJ File :
     * facePattern1 = ["1","2","3","4","5","6"]
     * facePattern2 = ["1/1","2/2","3/3","4/4","5/5","6/6"]
     * facePattern3 = ["1/1/1","2/2/2","3/3/3","4/4/4","5/5/5","6/6/6"]
     * facePattern4 = ["1//1","2//2","3//3","4//4","5//5","6//6"]
     * facePattern5 = ["-1/-1/-1","-2/-2/-2","-3/-3/-3","-4/-4/-4","-5/-5/-5","-6/-6/-6"]
     * Each pattern is divided by the same method
     * @param faces Array[String] The indices of elements
     * @param v Integer The variable to increment
     */
    _getTriangles(faces, v) {
        //Work for each element of the array
        for (let faceIndex = v; faceIndex < faces.length - 1; faceIndex++) {
            //Add on the triangle variable the indexes to obtain triangles
            this._pushTriangle(faces, faceIndex);
        }
        //Result obtained after 2 iterations:
        //Pattern1 => triangle = ["1","2","3","1","3","4"];
        //Pattern2 => triangle = ["1/1","2/2","3/3","1/1","3/3","4/4"];
        //Pattern3 => triangle = ["1/1/1","2/2/2","3/3/3","1/1/1","3/3/3","4/4/4"];
        //Pattern4 => triangle = ["1//1","2//2","3//3","1//1","3//3","4//4"];
        //Pattern5 => triangle = ["-1/-1/-1","-2/-2/-2","-3/-3/-3","-1/-1/-1","-3/-3/-3","-4/-4/-4"];
    }
    /**
     * To get color between color and extension color
     * @param index Integer The index of the element in the array
     * @returns value of target color
     */
    _getColor(index) {
        if (this._loadingOptions.importVertexColors) {
            return this._extColors[index] ?? this._colors[index];
        }
        else {
            return undefined;
        }
    }
    /**
     * Create triangles and push the data for each polygon for the pattern 1
     * In this pattern we get vertice positions
     * @param face
     * @param v
     */
    _setDataForCurrentFaceWithPattern1(face, v) {
        //Get the indices of triangles for each polygon
        this._getTriangles(face, v);
        //For each element in the triangles array.
        //This var could contains 1 to an infinity of triangles
        for (let k = 0; k < this._triangles.length; k++) {
            // Set position indice
            const indicePositionFromObj = parseInt(this._triangles[k]) - 1;
            this._setData(indicePositionFromObj, 0, 0, // In the pattern 1, normals and uvs are not defined
            this._positions[indicePositionFromObj], // Get the vectors data
            Vector2.Zero(), Vector3.Up(), // Create default vectors
            this._getColor(indicePositionFromObj));
        }
        //Reset variable for the next line
        this._triangles.length = 0;
    }
    /**
     * Create triangles and push the data for each polygon for the pattern 2
     * In this pattern we get vertice positions and uvs
     * @param face
     * @param v
     */
    _setDataForCurrentFaceWithPattern2(face, v) {
        //Get the indices of triangles for each polygon
        this._getTriangles(face, v);
        for (let k = 0; k < this._triangles.length; k++) {
            //triangle[k] = "1/1"
            //Split the data for getting position and uv
            const point = this._triangles[k].split("/"); // ["1", "1"]
            //Set position indice
            const indicePositionFromObj = parseInt(point[0]) - 1;
            //Set uv indice
            const indiceUvsFromObj = parseInt(point[1]) - 1;
            this._setData(indicePositionFromObj, indiceUvsFromObj, 0, //Default value for normals
            this._positions[indicePositionFromObj], //Get the values for each element
            this._uvs[indiceUvsFromObj] ?? Vector2.Zero(), Vector3.Up(), //Default value for normals
            this._getColor(indicePositionFromObj));
        }
        //Reset variable for the next line
        this._triangles.length = 0;
    }
    /**
     * Create triangles and push the data for each polygon for the pattern 3
     * In this pattern we get vertice positions, uvs and normals
     * @param face
     * @param v
     */
    _setDataForCurrentFaceWithPattern3(face, v) {
        //Get the indices of triangles for each polygon
        this._getTriangles(face, v);
        for (let k = 0; k < this._triangles.length; k++) {
            //triangle[k] = "1/1/1"
            //Split the data for getting position, uv, and normals
            const point = this._triangles[k].split("/"); // ["1", "1", "1"]
            // Set position indice
            const indicePositionFromObj = parseInt(point[0]) - 1;
            // Set uv indice
            const indiceUvsFromObj = parseInt(point[1]) - 1;
            // Set normal indice
            const indiceNormalFromObj = parseInt(point[2]) - 1;
            this._setData(indicePositionFromObj, indiceUvsFromObj, indiceNormalFromObj, this._positions[indicePositionFromObj], this._uvs[indiceUvsFromObj] ?? Vector2.Zero(), this._normals[indiceNormalFromObj] ?? Vector3.Up() //Set the vector for each component
            );
        }
        //Reset variable for the next line
        this._triangles.length = 0;
    }
    /**
     * Create triangles and push the data for each polygon for the pattern 4
     * In this pattern we get vertice positions and normals
     * @param face
     * @param v
     */
    _setDataForCurrentFaceWithPattern4(face, v) {
        this._getTriangles(face, v);
        for (let k = 0; k < this._triangles.length; k++) {
            //triangle[k] = "1//1"
            //Split the data for getting position and normals
            const point = this._triangles[k].split("//"); // ["1", "1"]
            // We check indices, and normals
            const indicePositionFromObj = parseInt(point[0]) - 1;
            const indiceNormalFromObj = parseInt(point[1]) - 1;
            this._setData(indicePositionFromObj, 1, //Default value for uv
            indiceNormalFromObj, this._positions[indicePositionFromObj], //Get each vector of data
            Vector2.Zero(), this._normals[indiceNormalFromObj], this._getColor(indicePositionFromObj));
        }
        //Reset variable for the next line
        this._triangles.length = 0;
    }
    /*
     * Create triangles and push the data for each polygon for the pattern 3
     * In this pattern we get vertice positions, uvs and normals
     * @param face
     * @param v
     */
    _setDataForCurrentFaceWithPattern5(face, v) {
        //Get the indices of triangles for each polygon
        this._getTriangles(face, v);
        for (let k = 0; k < this._triangles.length; k++) {
            //triangle[k] = "-1/-1/-1"
            //Split the data for getting position, uv, and normals
            const point = this._triangles[k].split("/"); // ["-1", "-1", "-1"]
            // Set position indice
            const indicePositionFromObj = this._positions.length + parseInt(point[0]);
            // Set uv indice
            const indiceUvsFromObj = this._uvs.length + parseInt(point[1]);
            // Set normal indice
            const indiceNormalFromObj = this._normals.length + parseInt(point[2]);
            this._setData(indicePositionFromObj, indiceUvsFromObj, indiceNormalFromObj, this._positions[indicePositionFromObj], this._uvs[indiceUvsFromObj], this._normals[indiceNormalFromObj], //Set the vector for each component
            this._getColor(indicePositionFromObj));
        }
        //Reset variable for the next line
        this._triangles.length = 0;
    }
    _addPreviousObjMesh() {
        //Check if it is not the first mesh. Otherwise we don't have data.
        if (this._meshesFromObj.length > 0) {
            //Get the previous mesh for applying the data about the faces
            //=> in obj file, faces definition append after the name of the mesh
            this._handledMesh = this._meshesFromObj[this._meshesFromObj.length - 1];
            //Set the data into Array for the mesh
            this._unwrapData();
            if (this._loadingOptions.useLegacyBehavior) {
                // Reverse tab. Otherwise face are displayed in the wrong sens
                this._indicesForBabylon.reverse();
            }
            //Set the information for the mesh
            //Slice the array to avoid rewriting because of the fact this is the same var which be rewrited
            this._handledMesh.indices = this._indicesForBabylon.slice();
            this._handledMesh.positions = this._unwrappedPositionsForBabylon.slice();
            this._handledMesh.normals = this._unwrappedNormalsForBabylon.slice();
            this._handledMesh.uvs = this._unwrappedUVForBabylon.slice();
            this._handledMesh.hasLines = this._hasLineData;
            if (this._loadingOptions.importVertexColors) {
                this._handledMesh.colors = this._unwrappedColorsForBabylon.slice();
            }
            //Reset the array for the next mesh
            this._indicesForBabylon.length = 0;
            this._unwrappedPositionsForBabylon.length = 0;
            this._unwrappedColorsForBabylon.length = 0;
            this._unwrappedNormalsForBabylon.length = 0;
            this._unwrappedUVForBabylon.length = 0;
            this._hasLineData = false;
        }
    }
    _optimizeNormals(mesh) {
        const positions = mesh.getVerticesData(VertexBuffer.PositionKind);
        const normals = mesh.getVerticesData(VertexBuffer.NormalKind);
        const mapVertices = {};
        if (!positions || !normals) {
            return;
        }
        for (let i = 0; i < positions.length / 3; i++) {
            const x = positions[i * 3 + 0];
            const y = positions[i * 3 + 1];
            const z = positions[i * 3 + 2];
            const key = x + "_" + y + "_" + z;
            let lst = mapVertices[key];
            if (!lst) {
                lst = [];
                mapVertices[key] = lst;
            }
            lst.push(i);
        }
        const normal = new Vector3();
        for (const key in mapVertices) {
            const lst = mapVertices[key];
            if (lst.length < 2) {
                continue;
            }
            const v0Idx = lst[0];
            for (let i = 1; i < lst.length; ++i) {
                const vIdx = lst[i];
                normals[v0Idx * 3 + 0] += normals[vIdx * 3 + 0];
                normals[v0Idx * 3 + 1] += normals[vIdx * 3 + 1];
                normals[v0Idx * 3 + 2] += normals[vIdx * 3 + 2];
            }
            normal.copyFromFloats(normals[v0Idx * 3 + 0], normals[v0Idx * 3 + 1], normals[v0Idx * 3 + 2]);
            normal.normalize();
            for (let i = 0; i < lst.length; ++i) {
                const vIdx = lst[i];
                normals[vIdx * 3 + 0] = normal.x;
                normals[vIdx * 3 + 1] = normal.y;
                normals[vIdx * 3 + 2] = normal.z;
            }
        }
        mesh.setVerticesData(VertexBuffer.NormalKind, normals);
    }
    static _IsLineElement(line) {
        return line.startsWith("l");
    }
    static _IsObjectElement(line) {
        return line.startsWith("o");
    }
    static _IsGroupElement(line) {
        return line.startsWith("g");
    }
    static _GetZbrushMRGB(line, notParse) {
        if (!line.startsWith("mrgb"))
            return null;
        line = line.replace("mrgb", "").trim();
        // if include vertex color , not load mrgb anymore
        if (notParse)
            return [];
        const regex = /[a-z0-9]/g;
        const regArray = line.match(regex);
        if (!regArray || regArray.length % 8 !== 0) {
            return [];
        }
        const array = [];
        for (let regIndex = 0; regIndex < regArray.length / 8; regIndex++) {
            //each item is MMRRGGBB, m is material index
            // const m = regArray[regIndex * 8 + 0] + regArray[regIndex * 8 + 1];
            const r = regArray[regIndex * 8 + 2] + regArray[regIndex * 8 + 3];
            const g = regArray[regIndex * 8 + 4] + regArray[regIndex * 8 + 5];
            const b = regArray[regIndex * 8 + 6] + regArray[regIndex * 8 + 7];
            array.push(new Color4(parseInt(r, 16) / 255, parseInt(g, 16) / 255, parseInt(b, 16) / 255, 1));
        }
        return array;
    }
    /**
     * Function used to parse an OBJ string
     * @param meshesNames defines the list of meshes to load (all if not defined)
     * @param data defines the OBJ string
     * @param scene defines the hosting scene
     * @param assetContainer defines the asset container to load data in
     * @param onFileToLoadFound defines a callback that will be called if a MTL file is found
     */
    parse(meshesNames, data, scene, assetContainer, onFileToLoadFound) {
        //Move Santitize here to forbid delete zbrush data
        // Sanitize data
        data = data.replace(/#MRGB/g, "mrgb");
        data = data.replace(/#.*$/gm, "").trim();
        if (this._loadingOptions.useLegacyBehavior) {
            this._pushTriangle = (faces, faceIndex) => this._triangles.push(faces[0], faces[faceIndex], faces[faceIndex + 1]);
            this._handednessSign = 1;
        }
        else if (scene.useRightHandedSystem) {
            this._pushTriangle = (faces, faceIndex) => this._triangles.push(faces[0], faces[faceIndex + 1], faces[faceIndex]);
            this._handednessSign = 1;
        }
        else {
            this._pushTriangle = (faces, faceIndex) => this._triangles.push(faces[0], faces[faceIndex], faces[faceIndex + 1]);
            this._handednessSign = -1;
        }
        // Split the file into lines
        // Preprocess line data
        const linesOBJ = data.split("\n");
        const lineLines = [];
        let currentGroup = [];
        lineLines.push(currentGroup);
        for (let i = 0; i < linesOBJ.length; i++) {
            const line = linesOBJ[i].trim().replace(/\s\s/g, " ");
            // Comment or newLine
            if (line.length === 0 || line.charAt(0) === "#") {
                continue;
            }
            if (SolidParser._IsGroupElement(line) || SolidParser._IsObjectElement(line)) {
                currentGroup = [];
                lineLines.push(currentGroup);
            }
            if (SolidParser._IsLineElement(line)) {
                const lineValues = line.split(" ");
                // create line elements with two vertices only
                for (let i = 1; i < lineValues.length - 1; i++) {
                    currentGroup.push(`l ${lineValues[i]} ${lineValues[i + 1]}`);
                }
            }
            else {
                currentGroup.push(line);
            }
        }
        const lines = lineLines.flat();
        // Look at each line
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim().replace(/\s\s/g, " ");
            let result;
            // Comment or newLine
            if (line.length === 0 || line.charAt(0) === "#") {
                continue;
            }
            else if (SolidParser.VertexPattern.test(line)) {
                //Get information about one position possible for the vertices
                result = line.match(/[^ ]+/g); // match will return non-null due to passing regex pattern
                // Value of result with line: "v 1.0 2.0 3.0"
                // ["v", "1.0", "2.0", "3.0"]
                // Create a Vector3 with the position x, y, z
                this._positions.push(new Vector3(parseFloat(result[1]), parseFloat(result[2]), parseFloat(result[3])));
                if (this._loadingOptions.importVertexColors) {
                    if (result.length >= 7) {
                        const r = parseFloat(result[4]);
                        const g = parseFloat(result[5]);
                        const b = parseFloat(result[6]);
                        this._colors.push(new Color4(r > 1 ? r / 255 : r, g > 1 ? g / 255 : g, b > 1 ? b / 255 : b, result.length === 7 || result[7] === undefined ? 1 : parseFloat(result[7])));
                    }
                    else {
                        // TODO: maybe push NULL and if all are NULL to skip (and remove grayColor var).
                        this._colors.push(this._grayColor);
                    }
                }
            }
            else if ((result = SolidParser.NormalPattern.exec(line)) !== null) {
                //Create a Vector3 with the normals x, y, z
                //Value of result
                // ["vn 1.0 2.0 3.0", "1.0", "2.0", "3.0"]
                //Add the Vector in the list of normals
                this._normals.push(new Vector3(parseFloat(result[1]), parseFloat(result[2]), parseFloat(result[3])));
            }
            else if ((result = SolidParser.UVPattern.exec(line)) !== null) {
                //Create a Vector2 with the normals u, v
                //Value of result
                // ["vt 0.1 0.2 0.3", "0.1", "0.2"]
                //Add the Vector in the list of uvs
                this._uvs.push(new Vector2(parseFloat(result[1]) * this._loadingOptions.UVScaling.x, parseFloat(result[2]) * this._loadingOptions.UVScaling.y));
                //Identify patterns of faces
                //Face could be defined in different type of pattern
            }
            else if ((result = SolidParser.FacePattern3.exec(line)) !== null) {
                //Value of result:
                //["f 1/1/1 2/2/2 3/3/3", "1/1/1 2/2/2 3/3/3"...]
                //Set the data for this face
                this._setDataForCurrentFaceWithPattern3(result[1].trim().split(" "), // ["1/1/1", "2/2/2", "3/3/3"]
                1);
            }
            else if ((result = SolidParser.FacePattern4.exec(line)) !== null) {
                //Value of result:
                //["f 1//1 2//2 3//3", "1//1 2//2 3//3"...]
                //Set the data for this face
                this._setDataForCurrentFaceWithPattern4(result[1].trim().split(" "), // ["1//1", "2//2", "3//3"]
                1);
            }
            else if ((result = SolidParser.FacePattern5.exec(line)) !== null) {
                //Value of result:
                //["f -1/-1/-1 -2/-2/-2 -3/-3/-3", "-1/-1/-1 -2/-2/-2 -3/-3/-3"...]
                //Set the data for this face
                this._setDataForCurrentFaceWithPattern5(result[1].trim().split(" "), // ["-1/-1/-1", "-2/-2/-2", "-3/-3/-3"]
                1);
            }
            else if ((result = SolidParser.FacePattern2.exec(line)) !== null) {
                //Value of result:
                //["f 1/1 2/2 3/3", "1/1 2/2 3/3"...]
                //Set the data for this face
                this._setDataForCurrentFaceWithPattern2(result[1].trim().split(" "), // ["1/1", "2/2", "3/3"]
                1);
            }
            else if ((result = SolidParser.FacePattern1.exec(line)) !== null) {
                //Value of result
                //["f 1 2 3", "1 2 3"...]
                //Set the data for this face
                this._setDataForCurrentFaceWithPattern1(result[1].trim().split(" "), // ["1", "2", "3"]
                1);
                // Define a mesh or an object
                // Each time this keyword is analyzed, create a new Object with all data for creating a babylonMesh
            }
            else if ((result = SolidParser.LinePattern1.exec(line)) !== null) {
                //Value of result
                //["l 1 2"]
                //Set the data for this face
                this._setDataForCurrentFaceWithPattern1(result[1].trim().split(" "), // ["1", "2"]
                0);
                this._hasLineData = true;
                // Define a mesh or an object
                // Each time this keyword is analyzed, create a new Object with all data for creating a babylonMesh
            }
            else if ((result = SolidParser.LinePattern2.exec(line)) !== null) {
                //Value of result
                //["l 1/1 2/2"]
                //Set the data for this face
                this._setDataForCurrentFaceWithPattern2(result[1].trim().split(" "), // ["1/1", "2/2"]
                0);
                this._hasLineData = true;
                // Define a mesh or an object
                // Each time this keyword is analyzed, create a new Object with all data for creating a babylonMesh
            }
            else if ((result = SolidParser._GetZbrushMRGB(line, !this._loadingOptions.importVertexColors))) {
                result.forEach((element) => {
                    this._extColors.push(element);
                });
            }
            else if ((result = SolidParser.LinePattern3.exec(line)) !== null) {
                //Value of result
                //["l 1/1/1 2/2/2"]
                //Set the data for this face
                this._setDataForCurrentFaceWithPattern3(result[1].trim().split(" "), // ["1/1/1", "2/2/2"]
                0);
                this._hasLineData = true;
                // Define a mesh or an object
                // Each time this keyword is analyzed, create a new Object with all data for creating a babylonMesh
            }
            else if (SolidParser.GroupDescriptor.test(line) || SolidParser.ObjectDescriptor.test(line)) {
                // Create a new mesh corresponding to the name of the group.
                // Definition of the mesh
                const objMesh = {
                    name: line.substring(2).trim(), //Set the name of the current obj mesh
                    indices: null,
                    positions: null,
                    normals: null,
                    uvs: null,
                    colors: null,
                    materialName: this._materialNameFromObj,
                    isObject: SolidParser.ObjectDescriptor.test(line),
                };
                this._addPreviousObjMesh();
                //Push the last mesh created with only the name
                this._meshesFromObj.push(objMesh);
                //Set this variable to indicate that now meshesFromObj has objects defined inside
                this._hasMeshes = true;
                this._isFirstMaterial = true;
                this._increment = 1;
                //Keyword for applying a material
            }
            else if (SolidParser.UseMtlDescriptor.test(line)) {
                //Get the name of the material
                this._materialNameFromObj = line.substring(7).trim();
                //If this new material is in the same mesh
                if (!this._isFirstMaterial || !this._hasMeshes) {
                    //Set the data for the previous mesh
                    this._addPreviousObjMesh();
                    //Create a new mesh
                    const objMesh = 
                    //Set the name of the current obj mesh
                    {
                        name: (this._objMeshName || "mesh") + "_mm" + this._increment.toString(), //Set the name of the current obj mesh
                        indices: null,
                        positions: null,
                        normals: null,
                        uvs: null,
                        colors: null,
                        materialName: this._materialNameFromObj,
                        isObject: false,
                    };
                    this._increment++;
                    //If meshes are already defined
                    this._meshesFromObj.push(objMesh);
                    this._hasMeshes = true;
                }
                //Set the material name if the previous line define a mesh
                if (this._hasMeshes && this._isFirstMaterial) {
                    //Set the material name to the previous mesh (1 material per mesh)
                    this._meshesFromObj[this._meshesFromObj.length - 1].materialName = this._materialNameFromObj;
                    this._isFirstMaterial = false;
                }
                // Keyword for loading the mtl file
            }
            else if (SolidParser.MtlLibGroupDescriptor.test(line)) {
                // Get the name of mtl file
                onFileToLoadFound(line.substring(7).trim());
                // Apply smoothing
            }
            else if (SolidParser.SmoothDescriptor.test(line)) ;
            else {
                //If there is another possibility
                Logger.Log("Unhandled expression at line : " + line);
            }
        }
        // At the end of the file, add the last mesh into the meshesFromObj array
        if (this._hasMeshes) {
            // Set the data for the last mesh
            this._handledMesh = this._meshesFromObj[this._meshesFromObj.length - 1];
            if (this._loadingOptions.useLegacyBehavior) {
                //Reverse indices for displaying faces in the good sense
                this._indicesForBabylon.reverse();
            }
            //Get the good array
            this._unwrapData();
            //Set array
            this._handledMesh.indices = this._indicesForBabylon;
            this._handledMesh.positions = this._unwrappedPositionsForBabylon;
            this._handledMesh.normals = this._unwrappedNormalsForBabylon;
            this._handledMesh.uvs = this._unwrappedUVForBabylon;
            this._handledMesh.hasLines = this._hasLineData;
            if (this._loadingOptions.importVertexColors) {
                this._handledMesh.colors = this._unwrappedColorsForBabylon;
            }
        }
        // If any o or g keyword not found, create a mesh with a random id
        if (!this._hasMeshes) {
            let newMaterial = null;
            if (this._indicesForBabylon.length) {
                if (this._loadingOptions.useLegacyBehavior) {
                    // reverse tab of indices
                    this._indicesForBabylon.reverse();
                }
                //Get positions normals uvs
                this._unwrapData();
            }
            else {
                // There is no indices in the file. We will have to switch to point cloud rendering
                for (const pos of this._positions) {
                    this._unwrappedPositionsForBabylon.push(pos.x, pos.y, pos.z);
                }
                if (this._normals.length) {
                    for (const normal of this._normals) {
                        this._unwrappedNormalsForBabylon.push(normal.x, normal.y, normal.z);
                    }
                }
                if (this._uvs.length) {
                    for (const uv of this._uvs) {
                        this._unwrappedUVForBabylon.push(uv.x, uv.y);
                    }
                }
                if (this._extColors.length) {
                    for (const color of this._extColors) {
                        this._unwrappedColorsForBabylon.push(color.r, color.g, color.b, color.a);
                    }
                }
                else {
                    if (this._colors.length) {
                        for (const color of this._colors) {
                            this._unwrappedColorsForBabylon.push(color.r, color.g, color.b, color.a);
                        }
                    }
                }
                if (!this._materialNameFromObj) {
                    // Create a material with point cloud on
                    newMaterial = new StandardMaterial(Geometry.RandomId(), scene);
                    newMaterial.pointsCloud = true;
                    this._materialNameFromObj = newMaterial.name;
                    if (!this._normals.length) {
                        newMaterial.disableLighting = true;
                        newMaterial.emissiveColor = Color3.White();
                    }
                }
            }
            //Set data for one mesh
            this._meshesFromObj.push({
                name: Geometry.RandomId(),
                indices: this._indicesForBabylon,
                positions: this._unwrappedPositionsForBabylon,
                colors: this._unwrappedColorsForBabylon,
                normals: this._unwrappedNormalsForBabylon,
                uvs: this._unwrappedUVForBabylon,
                materialName: this._materialNameFromObj,
                directMaterial: newMaterial,
                isObject: true,
                hasLines: this._hasLineData,
            });
        }
        //Set data for each mesh
        for (let j = 0; j < this._meshesFromObj.length; j++) {
            //check meshesNames (stlFileLoader)
            if (meshesNames && this._meshesFromObj[j].name) {
                if (meshesNames instanceof Array) {
                    if (meshesNames.indexOf(this._meshesFromObj[j].name) === -1) {
                        continue;
                    }
                }
                else {
                    if (this._meshesFromObj[j].name !== meshesNames) {
                        continue;
                    }
                }
            }
            //Get the current mesh
            //Set the data with VertexBuffer for each mesh
            this._handledMesh = this._meshesFromObj[j];
            //Create a Mesh with the name of the obj mesh
            scene._blockEntityCollection = !!assetContainer;
            const babylonMesh = new Mesh(this._meshesFromObj[j].name, scene);
            babylonMesh._parentContainer = assetContainer;
            scene._blockEntityCollection = false;
            this._handledMesh._babylonMesh = babylonMesh;
            // If this is a group mesh, it should have an object mesh as a parent. So look for the first object mesh that appears before it.
            if (!this._handledMesh.isObject) {
                for (let k = j - 1; k >= 0; --k) {
                    if (this._meshesFromObj[k].isObject && this._meshesFromObj[k]._babylonMesh) {
                        babylonMesh.parent = this._meshesFromObj[k]._babylonMesh;
                        break;
                    }
                }
            }
            //Push the name of the material to an array
            //This is indispensable for the importMesh function
            this._materialToUse.push(this._meshesFromObj[j].materialName);
            //If the mesh is a line mesh
            if (this._handledMesh.hasLines) {
                babylonMesh._internalMetadata ?? (babylonMesh._internalMetadata = {});
                babylonMesh._internalMetadata["_isLine"] = true; //this is a line mesh
            }
            if (this._handledMesh.positions?.length === 0) {
                //Push the mesh into an array
                this._babylonMeshesArray.push(babylonMesh);
                continue;
            }
            const vertexData = new VertexData(); //The container for the values
            //Set the data for the babylonMesh
            vertexData.uvs = this._handledMesh.uvs;
            vertexData.indices = this._handledMesh.indices;
            vertexData.positions = this._handledMesh.positions;
            if (this._loadingOptions.computeNormals) {
                const normals = new Array();
                VertexData.ComputeNormals(this._handledMesh.positions, this._handledMesh.indices, normals);
                vertexData.normals = normals;
            }
            else {
                vertexData.normals = this._handledMesh.normals;
            }
            if (this._loadingOptions.importVertexColors) {
                vertexData.colors = this._handledMesh.colors;
            }
            //Set the data from the VertexBuffer to the current Mesh
            vertexData.applyToMesh(babylonMesh);
            if (this._loadingOptions.invertY) {
                babylonMesh.scaling.y *= -1;
            }
            if (this._loadingOptions.optimizeNormals) {
                this._optimizeNormals(babylonMesh);
            }
            //Push the mesh into an array
            this._babylonMeshesArray.push(babylonMesh);
            if (this._handledMesh.directMaterial) {
                babylonMesh.material = this._handledMesh.directMaterial;
            }
        }
    }
}
// Descriptor
/** Object descriptor */
SolidParser.ObjectDescriptor = /^o/;
/** Group descriptor */
SolidParser.GroupDescriptor = /^g/;
/** Material lib descriptor */
SolidParser.MtlLibGroupDescriptor = /^mtllib /;
/** Use a material descriptor */
SolidParser.UseMtlDescriptor = /^usemtl /;
/** Smooth descriptor */
SolidParser.SmoothDescriptor = /^s /;
// Patterns
/** Pattern used to detect a vertex */
SolidParser.VertexPattern = /^v(\s+[\d|.|+|\-|e|E]+){3,7}/;
/** Pattern used to detect a normal */
SolidParser.NormalPattern = /^vn(\s+[\d|.|+|\-|e|E]+)( +[\d|.|+|\-|e|E]+)( +[\d|.|+|\-|e|E]+)/;
/** Pattern used to detect a UV set */
SolidParser.UVPattern = /^vt(\s+[\d|.|+|\-|e|E]+)( +[\d|.|+|\-|e|E]+)/;
/** Pattern used to detect a first kind of face (f vertex vertex vertex) */
SolidParser.FacePattern1 = /^f\s+(([\d]{1,}[\s]?){3,})+/;
/** Pattern used to detect a second kind of face (f vertex/uvs vertex/uvs vertex/uvs) */
SolidParser.FacePattern2 = /^f\s+((([\d]{1,}\/[\d]{1,}[\s]?){3,})+)/;
/** Pattern used to detect a third kind of face (f vertex/uvs/normal vertex/uvs/normal vertex/uvs/normal) */
SolidParser.FacePattern3 = /^f\s+((([\d]{1,}\/[\d]{1,}\/[\d]{1,}[\s]?){3,})+)/;
/** Pattern used to detect a fourth kind of face (f vertex//normal vertex//normal vertex//normal)*/
SolidParser.FacePattern4 = /^f\s+((([\d]{1,}\/\/[\d]{1,}[\s]?){3,})+)/;
/** Pattern used to detect a fifth kind of face (f -vertex/-uvs/-normal -vertex/-uvs/-normal -vertex/-uvs/-normal) */
SolidParser.FacePattern5 = /^f\s+(((-[\d]{1,}\/-[\d]{1,}\/-[\d]{1,}[\s]?){3,})+)/;
/** Pattern used to detect a line(l vertex vertex) */
SolidParser.LinePattern1 = /^l\s+(([\d]{1,}[\s]?){2,})+/;
/** Pattern used to detect a second kind of line (l vertex/uvs vertex/uvs) */
SolidParser.LinePattern2 = /^l\s+((([\d]{1,}\/[\d]{1,}[\s]?){2,})+)/;
/** Pattern used to detect a third kind of line (l vertex/uvs/normal vertex/uvs/normal) */
SolidParser.LinePattern3 = /^l\s+((([\d]{1,}\/[\d]{1,}\/[\d]{1,}[\s]?){2,})+)/;

const OBJFileLoaderMetadata = {
    name: "obj",
    extensions: ".obj",
};

/**
 * OBJ file type loader.
 * This is a babylon scene loader plugin.
 */
class OBJFileLoader {
    /**
     * Invert Y-Axis of referenced textures on load
     */
    static get INVERT_TEXTURE_Y() {
        return MTLFileLoader.INVERT_TEXTURE_Y;
    }
    static set INVERT_TEXTURE_Y(value) {
        MTLFileLoader.INVERT_TEXTURE_Y = value;
    }
    /**
     * Creates loader for .OBJ files
     *
     * @param loadingOptions options for loading and parsing OBJ/MTL files.
     */
    constructor(loadingOptions) {
        /**
         * Defines the name of the plugin.
         */
        this.name = OBJFileLoaderMetadata.name;
        /**
         * Defines the extension the plugin is able to load.
         */
        this.extensions = OBJFileLoaderMetadata.extensions;
        this._assetContainer = null;
        this._loadingOptions = loadingOptions || OBJFileLoader._DefaultLoadingOptions;
    }
    static get _DefaultLoadingOptions() {
        return {
            computeNormals: OBJFileLoader.COMPUTE_NORMALS,
            optimizeNormals: OBJFileLoader.OPTIMIZE_NORMALS,
            importVertexColors: OBJFileLoader.IMPORT_VERTEX_COLORS,
            invertY: OBJFileLoader.INVERT_Y,
            invertTextureY: OBJFileLoader.INVERT_TEXTURE_Y,
            // eslint-disable-next-line @typescript-eslint/naming-convention
            UVScaling: OBJFileLoader.UV_SCALING,
            materialLoadingFailsSilently: OBJFileLoader.MATERIAL_LOADING_FAILS_SILENTLY,
            optimizeWithUV: OBJFileLoader.OPTIMIZE_WITH_UV,
            skipMaterials: OBJFileLoader.SKIP_MATERIALS,
            useLegacyBehavior: OBJFileLoader.USE_LEGACY_BEHAVIOR,
        };
    }
    /**
     * Calls synchronously the MTL file attached to this obj.
     * Load function or importMesh function don't enable to load 2 files in the same time asynchronously.
     * Without this function materials are not displayed in the first frame (but displayed after).
     * In consequence it is impossible to get material information in your HTML file
     *
     * @param url The URL of the MTL file
     * @param rootUrl defines where to load data from
     * @param onSuccess Callback function to be called when the MTL file is loaded
     * @param onFailure
     */
    _loadMTL(url, rootUrl, onSuccess, onFailure) {
        //The complete path to the mtl file
        const pathOfFile = rootUrl + url;
        // Loads through the babylon tools to allow fileInput search.
        Tools.LoadFile(pathOfFile, onSuccess, undefined, undefined, false, (request, exception) => {
            onFailure(pathOfFile, exception);
        });
    }
    /**
     * Instantiates a OBJ file loader plugin.
     * @returns the created plugin
     */
    createPlugin() {
        return new OBJFileLoader(OBJFileLoader._DefaultLoadingOptions);
    }
    /**
     * If the data string can be loaded directly.
     * @returns if the data can be loaded directly
     */
    canDirectLoad() {
        return false;
    }
    /**
     * Imports one or more meshes from the loaded OBJ data and adds them to the scene
     * @param meshesNames a string or array of strings of the mesh names that should be loaded from the file
     * @param scene the scene the meshes should be added to
     * @param data the OBJ data to load
     * @param rootUrl root url to load from
     * @returns a promise containing the loaded meshes, particles, skeletons and animations
     */
    importMeshAsync(meshesNames, scene, data, rootUrl) {
        //get the meshes from OBJ file
        return this._parseSolid(meshesNames, scene, data, rootUrl).then((meshes) => {
            return {
                meshes: meshes,
                particleSystems: [],
                skeletons: [],
                animationGroups: [],
                transformNodes: [],
                geometries: [],
                lights: [],
                spriteManagers: [],
            };
        });
    }
    /**
     * Imports all objects from the loaded OBJ data and adds them to the scene
     * @param scene the scene the objects should be added to
     * @param data the OBJ data to load
     * @param rootUrl root url to load from
     * @returns a promise which completes when objects have been loaded to the scene
     */
    loadAsync(scene, data, rootUrl) {
        //Get the 3D model
        return this.importMeshAsync(null, scene, data, rootUrl).then(() => {
            // return void
        });
    }
    /**
     * Load into an asset container.
     * @param scene The scene to load into
     * @param data The data to import
     * @param rootUrl The root url for scene and resources
     * @returns The loaded asset container
     */
    loadAssetContainerAsync(scene, data, rootUrl) {
        const container = new AssetContainer(scene);
        this._assetContainer = container;
        return this.importMeshAsync(null, scene, data, rootUrl)
            .then((result) => {
            result.meshes.forEach((mesh) => container.meshes.push(mesh));
            result.meshes.forEach((mesh) => {
                const material = mesh.material;
                if (material) {
                    // Materials
                    if (container.materials.indexOf(material) == -1) {
                        container.materials.push(material);
                        // Textures
                        const textures = material.getActiveTextures();
                        textures.forEach((t) => {
                            if (container.textures.indexOf(t) == -1) {
                                container.textures.push(t);
                            }
                        });
                    }
                }
            });
            this._assetContainer = null;
            return container;
        })
            .catch((ex) => {
            this._assetContainer = null;
            throw ex;
        });
    }
    /**
     * Read the OBJ file and create an Array of meshes.
     * Each mesh contains all information given by the OBJ and the MTL file.
     * i.e. vertices positions and indices, optional normals values, optional UV values, optional material
     * @param meshesNames defines a string or array of strings of the mesh names that should be loaded from the file
     * @param scene defines the scene where are displayed the data
     * @param data defines the content of the obj file
     * @param rootUrl defines the path to the folder
     * @returns the list of loaded meshes
     */
    _parseSolid(meshesNames, scene, data, rootUrl) {
        let fileToLoad = ""; //The name of the mtlFile to load
        const materialsFromMTLFile = new MTLFileLoader();
        const materialToUse = [];
        const babylonMeshesArray = []; //The mesh for babylon
        // Sanitize data
        data = data.replace(/#.*$/gm, "").trim();
        // Main function
        const solidParser = new SolidParser(materialToUse, babylonMeshesArray, this._loadingOptions);
        solidParser.parse(meshesNames, data, scene, this._assetContainer, (fileName) => {
            fileToLoad = fileName;
        });
        // load the materials
        const mtlPromises = [];
        // Check if we have a file to load
        if (fileToLoad !== "" && !this._loadingOptions.skipMaterials) {
            //Load the file synchronously
            mtlPromises.push(new Promise((resolve, reject) => {
                this._loadMTL(fileToLoad, rootUrl, (dataLoaded) => {
                    try {
                        //Create materials thanks MTLLoader function
                        materialsFromMTLFile.parseMTL(scene, dataLoaded, rootUrl, this._assetContainer);
                        //Look at each material loaded in the mtl file
                        for (let n = 0; n < materialsFromMTLFile.materials.length; n++) {
                            //Three variables to get all meshes with the same material
                            let startIndex = 0;
                            const _indices = [];
                            let _index;
                            //The material from MTL file is used in the meshes loaded
                            //Push the indice in an array
                            //Check if the material is not used for another mesh
                            while ((_index = materialToUse.indexOf(materialsFromMTLFile.materials[n].name, startIndex)) > -1) {
                                _indices.push(_index);
                                startIndex = _index + 1;
                            }
                            //If the material is not used dispose it
                            if (_index === -1 && _indices.length === 0) {
                                //If the material is not needed, remove it
                                materialsFromMTLFile.materials[n].dispose();
                            }
                            else {
                                for (let o = 0; o < _indices.length; o++) {
                                    //Apply the material to the Mesh for each mesh with the material
                                    const mesh = babylonMeshesArray[_indices[o]];
                                    const material = materialsFromMTLFile.materials[n];
                                    mesh.material = material;
                                    if (!mesh.getTotalIndices()) {
                                        // No indices, we need to turn on point cloud
                                        material.pointsCloud = true;
                                    }
                                }
                            }
                        }
                        resolve();
                    }
                    catch (e) {
                        Tools.Warn(`Error processing MTL file: '${fileToLoad}'`);
                        if (this._loadingOptions.materialLoadingFailsSilently) {
                            resolve();
                        }
                        else {
                            reject(e);
                        }
                    }
                }, (pathOfFile, exception) => {
                    Tools.Warn(`Error downloading MTL file: '${fileToLoad}'`);
                    if (this._loadingOptions.materialLoadingFailsSilently) {
                        resolve();
                    }
                    else {
                        reject(exception);
                    }
                });
            }));
        }
        //Return an array with all Mesh
        return Promise.all(mtlPromises).then(() => {
            const isLine = (mesh) => Boolean(mesh._internalMetadata?.["_isLine"] ?? false);
            // Iterate over the mesh, determine if it is a line mesh, clone or modify the material to line rendering.
            babylonMeshesArray.forEach((mesh) => {
                if (isLine(mesh)) {
                    let mat = mesh.material ?? new StandardMaterial(mesh.name + "_line", scene);
                    // If another mesh is using this material and it is not a line then we need to clone it.
                    const needClone = mat.getBindedMeshes().filter((e) => !isLine(e)).length > 0;
                    if (needClone) {
                        mat = mat.clone(mat.name + "_line") ?? mat;
                    }
                    mat.wireframe = true;
                    mesh.material = mat;
                    if (mesh._internalMetadata) {
                        mesh._internalMetadata["_isLine"] = undefined;
                    }
                }
            });
            return babylonMeshesArray;
        });
    }
}
/**
 * Defines if UVs are optimized by default during load.
 */
OBJFileLoader.OPTIMIZE_WITH_UV = true;
/**
 * Invert model on y-axis (does a model scaling inversion)
 */
OBJFileLoader.INVERT_Y = false;
/**
 * Include in meshes the vertex colors available in some OBJ files.  This is not part of OBJ standard.
 */
OBJFileLoader.IMPORT_VERTEX_COLORS = false;
/**
 * Compute the normals for the model, even if normals are present in the file.
 */
OBJFileLoader.COMPUTE_NORMALS = false;
/**
 * Optimize the normals for the model. Lighting can be uneven if you use OptimizeWithUV = true because new vertices can be created for the same location if they pertain to different faces.
 * Using OptimizehNormals = true will help smoothing the lighting by averaging the normals of those vertices.
 */
OBJFileLoader.OPTIMIZE_NORMALS = false;
/**
 * Defines custom scaling of UV coordinates of loaded meshes.
 */
OBJFileLoader.UV_SCALING = new Vector2(1, 1);
/**
 * Skip loading the materials even if defined in the OBJ file (materials are ignored).
 */
OBJFileLoader.SKIP_MATERIALS = false;
/**
 * When a material fails to load OBJ loader will silently fail and onSuccess() callback will be triggered.
 *
 * Defaults to true for backwards compatibility.
 */
OBJFileLoader.MATERIAL_LOADING_FAILS_SILENTLY = true;
/**
 * Loads assets without handedness conversions. This flag is for compatibility. Use it only if absolutely required. Defaults to false.
 */
OBJFileLoader.USE_LEGACY_BEHAVIOR = false;
//Add this loader into the register plugin
registerSceneLoaderPlugin(new OBJFileLoader());

const STLFileLoaderMetadata = {
    name: "stl",
    extensions: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        ".stl": { isBinary: true },
    },
};

/**
 * STL file type loader.
 * This is a babylon scene loader plugin.
 */
class STLFileLoader {
    constructor() {
        /** @internal */
        this.solidPattern = /solid (\S*)([\S\s]*?)endsolid[ ]*(\S*)/g;
        /** @internal */
        this.facetsPattern = /facet([\s\S]*?)endfacet/g;
        /** @internal */
        this.normalPattern = /normal[\s]+([-+]?[0-9]+\.?[0-9]*([eE][-+]?[0-9]+)?)+[\s]+([-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?)+[\s]+([-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?)+/g;
        /** @internal */
        this.vertexPattern = /vertex[\s]+([-+]?[0-9]+\.?[0-9]*([eE][-+]?[0-9]+)?)+[\s]+([-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?)+[\s]+([-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?)+/g;
        /**
         * Defines the name of the plugin.
         */
        this.name = STLFileLoaderMetadata.name;
        /**
         * Defines the extensions the stl loader is able to load.
         * force data to come in as an ArrayBuffer
         * we'll convert to string if it looks like it's an ASCII .stl
         */
        this.extensions = STLFileLoaderMetadata.extensions;
    }
    /**
     * Import meshes into a scene.
     * @param meshesNames An array of mesh names, a single mesh name, or empty string for all meshes that filter what meshes are imported
     * @param scene The scene to import into
     * @param data The data to import
     * @param rootUrl The root url for scene and resources
     * @param meshes The meshes array to import into
     * @returns True if successful or false otherwise
     */
    importMesh(meshesNames, scene, data, rootUrl, meshes) {
        let matches;
        if (typeof data !== "string") {
            if (this._isBinary(data)) {
                // binary .stl
                const babylonMesh = new Mesh("stlmesh", scene);
                this._parseBinary(babylonMesh, data);
                if (meshes) {
                    meshes.push(babylonMesh);
                }
                return true;
            }
            // ASCII .stl
            // convert to string
            data = new TextDecoder().decode(new Uint8Array(data));
        }
        //if arrived here, data is a string, containing the STLA data.
        while ((matches = this.solidPattern.exec(data))) {
            let meshName = matches[1];
            const meshNameFromEnd = matches[3];
            if (meshNameFromEnd && meshName != meshNameFromEnd) {
                Tools.Error("Error in STL, solid name != endsolid name");
                return false;
            }
            // check meshesNames
            if (meshesNames && meshName) {
                if (meshesNames instanceof Array) {
                    if (!meshesNames.indexOf(meshName)) {
                        continue;
                    }
                }
                else {
                    if (meshName !== meshesNames) {
                        continue;
                    }
                }
            }
            // stl mesh name can be empty as well
            meshName = meshName || "stlmesh";
            const babylonMesh = new Mesh(meshName, scene);
            this._parseASCII(babylonMesh, matches[2]);
            if (meshes) {
                meshes.push(babylonMesh);
            }
        }
        return true;
    }
    /**
     * Load into a scene.
     * @param scene The scene to load into
     * @param data The data to import
     * @param rootUrl The root url for scene and resources
     * @returns true if successful or false otherwise
     */
    load(scene, data, rootUrl) {
        const result = this.importMesh(null, scene, data, rootUrl, null);
        return result;
    }
    /**
     * Load into an asset container.
     * @param scene The scene to load into
     * @param data The data to import
     * @param rootUrl The root url for scene and resources
     * @returns The loaded asset container
     */
    loadAssetContainer(scene, data, rootUrl) {
        const container = new AssetContainer(scene);
        scene._blockEntityCollection = true;
        this.importMesh(null, scene, data, rootUrl, container.meshes);
        scene._blockEntityCollection = false;
        return container;
    }
    _isBinary(data) {
        // check if file size is correct for binary stl
        const reader = new DataView(data);
        // A Binary STL header is 80 bytes, if the data size is not great than
        // that then it's not a binary STL.
        if (reader.byteLength <= 80) {
            return false;
        }
        const faceSize = (32 / 8) * 3 + (32 / 8) * 3 * 3 + 16 / 8;
        const nFaces = reader.getUint32(80, true);
        if (80 + 32 / 8 + nFaces * faceSize === reader.byteLength) {
            return true;
        }
        // US-ASCII begin with 's', 'o', 'l', 'i', 'd'
        const ascii = [115, 111, 108, 105, 100];
        for (let off = 0; off < 5; off++) {
            if (reader.getUint8(off) !== ascii[off]) {
                return true;
            }
        }
        return false;
    }
    _parseBinary(mesh, data) {
        const reader = new DataView(data);
        const faces = reader.getUint32(80, true);
        const dataOffset = 84;
        const faceLength = 12 * 4 + 2;
        let offset = 0;
        const positions = new Float32Array(faces * 3 * 3);
        const normals = new Float32Array(faces * 3 * 3);
        const indices = new Uint32Array(faces * 3);
        let indicesCount = 0;
        for (let face = 0; face < faces; face++) {
            const start = dataOffset + face * faceLength;
            const normalX = reader.getFloat32(start, true);
            const normalY = reader.getFloat32(start + 4, true);
            const normalZ = reader.getFloat32(start + 8, true);
            for (let i = 1; i <= 3; i++) {
                const vertexstart = start + i * 12;
                // ordering is intentional to match ascii import
                positions[offset] = reader.getFloat32(vertexstart, true);
                normals[offset] = normalX;
                if (!STLFileLoader.DO_NOT_ALTER_FILE_COORDINATES) {
                    positions[offset + 2] = reader.getFloat32(vertexstart + 4, true);
                    positions[offset + 1] = reader.getFloat32(vertexstart + 8, true);
                    normals[offset + 2] = normalY;
                    normals[offset + 1] = normalZ;
                }
                else {
                    positions[offset + 1] = reader.getFloat32(vertexstart + 4, true);
                    positions[offset + 2] = reader.getFloat32(vertexstart + 8, true);
                    normals[offset + 1] = normalY;
                    normals[offset + 2] = normalZ;
                }
                offset += 3;
            }
            if (STLFileLoader.DO_NOT_ALTER_FILE_COORDINATES) {
                indices[indicesCount] = indicesCount;
                indices[indicesCount + 1] = indicesCount + 2;
                indices[indicesCount + 2] = indicesCount + 1;
                indicesCount += 3;
            }
            else {
                indices[indicesCount] = indicesCount++;
                indices[indicesCount] = indicesCount++;
                indices[indicesCount] = indicesCount++;
            }
        }
        mesh.setVerticesData(VertexBuffer.PositionKind, positions);
        mesh.setVerticesData(VertexBuffer.NormalKind, normals);
        mesh.setIndices(indices);
        mesh.computeWorldMatrix(true);
    }
    _parseASCII(mesh, solidData) {
        const positions = [];
        const normals = [];
        const indices = [];
        let indicesCount = 0;
        //load facets, ignoring loop as the standard doesn't define it can contain more than vertices
        let matches;
        while ((matches = this.facetsPattern.exec(solidData))) {
            const facet = matches[1];
            //one normal per face
            const normalMatches = this.normalPattern.exec(facet);
            this.normalPattern.lastIndex = 0;
            if (!normalMatches) {
                continue;
            }
            const normal = [Number(normalMatches[1]), Number(normalMatches[5]), Number(normalMatches[3])];
            let vertexMatch;
            while ((vertexMatch = this.vertexPattern.exec(facet))) {
                if (!STLFileLoader.DO_NOT_ALTER_FILE_COORDINATES) {
                    positions.push(Number(vertexMatch[1]), Number(vertexMatch[5]), Number(vertexMatch[3]));
                    normals.push(normal[0], normal[1], normal[2]);
                }
                else {
                    positions.push(Number(vertexMatch[1]), Number(vertexMatch[3]), Number(vertexMatch[5]));
                    // Flipping the second and third component because inverted
                    // when normal was declared.
                    normals.push(normal[0], normal[2], normal[1]);
                }
            }
            if (STLFileLoader.DO_NOT_ALTER_FILE_COORDINATES) {
                indices.push(indicesCount, indicesCount + 2, indicesCount + 1);
                indicesCount += 3;
            }
            else {
                indices.push(indicesCount++, indicesCount++, indicesCount++);
            }
            this.vertexPattern.lastIndex = 0;
        }
        this.facetsPattern.lastIndex = 0;
        mesh.setVerticesData(VertexBuffer.PositionKind, positions);
        mesh.setVerticesData(VertexBuffer.NormalKind, normals);
        mesh.setIndices(indices);
        mesh.computeWorldMatrix(true);
    }
}
/**
 * Defines if Y and Z axes are swapped or not when loading an STL file.
 * The default is false to maintain backward compatibility. When set to
 * true, coordinates from the STL file are used without change.
 */
STLFileLoader.DO_NOT_ALTER_FILE_COORDINATES = false;
registerSceneLoaderPlugin(new STLFileLoader());

const SPLATFileLoaderMetadata = {
    name: "splat",
    extensions: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        ".splat": { isBinary: true },
        // eslint-disable-next-line @typescript-eslint/naming-convention
        ".ply": { isBinary: true },
        // eslint-disable-next-line @typescript-eslint/naming-convention
        ".spz": { isBinary: true },
    },
};

/**
 * Indicator of the parsed ply buffer. A standard ready to use splat or an array of positions for a point cloud
 */
var Mode;
(function (Mode) {
    Mode[Mode["Splat"] = 0] = "Splat";
    Mode[Mode["PointCloud"] = 1] = "PointCloud";
    Mode[Mode["Mesh"] = 2] = "Mesh";
    Mode[Mode["Reject"] = 3] = "Reject";
})(Mode || (Mode = {}));
/**
 * @experimental
 * SPLAT file type loader.
 * This is a babylon scene loader plugin.
 */
class SPLATFileLoader {
    /**
     * Creates loader for gaussian splatting files
     * @param loadingOptions options for loading and parsing splat and PLY files.
     */
    constructor(loadingOptions = SPLATFileLoader._DefaultLoadingOptions) {
        /**
         * Defines the name of the plugin.
         */
        this.name = SPLATFileLoaderMetadata.name;
        this._assetContainer = null;
        /**
         * Defines the extensions the splat loader is able to load.
         * force data to come in as an ArrayBuffer
         */
        this.extensions = SPLATFileLoaderMetadata.extensions;
        this._loadingOptions = loadingOptions;
    }
    /** @internal */
    createPlugin(options) {
        return new SPLATFileLoader(options[SPLATFileLoaderMetadata.name]);
    }
    /**
     * Imports  from the loaded gaussian splatting data and adds them to the scene
     * @param meshesNames a string or array of strings of the mesh names that should be loaded from the file
     * @param scene the scene the meshes should be added to
     * @param data the gaussian splatting data to load
     * @param rootUrl root url to load from
     * @param onProgress callback called while file is loading
     * @param fileName Defines the name of the file to load
     * @returns a promise containing the loaded meshes, particles, skeletons and animations
     */
    async importMeshAsync(meshesNames, scene, data, rootUrl, onProgress, fileName) {
        return this._parse(meshesNames, scene, data, rootUrl).then((meshes) => {
            return {
                meshes: meshes,
                particleSystems: [],
                skeletons: [],
                animationGroups: [],
                transformNodes: [],
                geometries: [],
                lights: [],
                spriteManagers: [],
            };
        });
    }
    static _BuildPointCloud(pointcloud, data) {
        if (!data.byteLength) {
            return false;
        }
        const uBuffer = new Uint8Array(data);
        const fBuffer = new Float32Array(data);
        // parsed array contains room for position(3floats), normal(3floats), color (4b), quantized quaternion (4b)
        const rowLength = 3 * 4 + 3 * 4 + 4 + 4;
        const vertexCount = uBuffer.length / rowLength;
        const pointcloudfunc = function (particle, i) {
            const x = fBuffer[8 * i + 0];
            const y = fBuffer[8 * i + 1];
            const z = fBuffer[8 * i + 2];
            particle.position = new Vector3(x, y, z);
            const r = uBuffer[rowLength * i + 24 + 0] / 255;
            const g = uBuffer[rowLength * i + 24 + 1] / 255;
            const b = uBuffer[rowLength * i + 24 + 2] / 255;
            particle.color = new Color4(r, g, b, 1);
        };
        pointcloud.addPoints(vertexCount, pointcloudfunc);
        return true;
    }
    static _BuildMesh(scene, parsedPLY) {
        const mesh = new Mesh("PLYMesh", scene);
        const uBuffer = new Uint8Array(parsedPLY.data);
        const fBuffer = new Float32Array(parsedPLY.data);
        const rowLength = 3 * 4 + 3 * 4 + 4 + 4;
        const vertexCount = uBuffer.length / rowLength;
        const positions = [];
        const vertexData = new VertexData();
        for (let i = 0; i < vertexCount; i++) {
            const x = fBuffer[8 * i + 0];
            const y = fBuffer[8 * i + 1];
            const z = fBuffer[8 * i + 2];
            positions.push(x, y, z);
        }
        if (parsedPLY.hasVertexColors) {
            const colors = new Float32Array(vertexCount * 4);
            for (let i = 0; i < vertexCount; i++) {
                const r = uBuffer[rowLength * i + 24 + 0] / 255;
                const g = uBuffer[rowLength * i + 24 + 1] / 255;
                const b = uBuffer[rowLength * i + 24 + 2] / 255;
                colors[i * 4 + 0] = r;
                colors[i * 4 + 1] = g;
                colors[i * 4 + 2] = b;
                colors[i * 4 + 3] = 1;
            }
            vertexData.colors = colors;
        }
        vertexData.positions = positions;
        vertexData.indices = parsedPLY.faces;
        vertexData.applyToMesh(mesh);
        return mesh;
    }
    _parseSPZ(data, scene) {
        const ubuf = new Uint8Array(data);
        const ubufu32 = new Uint32Array(data);
        // debug infos
        const splatCount = ubufu32[2];
        const shDegree = ubuf[12];
        const fractionalBits = ubuf[13];
        //const flags = ubuf[14];
        const reserved = ubuf[15];
        // check magic and version
        if (reserved || ubufu32[0] != 0x5053474e || ubufu32[1] != 2) {
            // reserved must be 0
            return new Promise((resolve) => {
                resolve({ mode: 3 /* Mode.Reject */, data: buffer, hasVertexColors: false });
            });
        }
        const rowOutputLength = 3 * 4 + 3 * 4 + 4 + 4; // 32
        const buffer = new ArrayBuffer(rowOutputLength * splatCount);
        const positionScale = 1.0 / (1 << fractionalBits);
        const int32View = new Int32Array(1);
        const uint8View = new Uint8Array(int32View.buffer);
        const read24bComponent = function (u8, offset) {
            uint8View[0] = u8[offset + 0];
            uint8View[1] = u8[offset + 1];
            uint8View[2] = u8[offset + 2];
            uint8View[3] = u8[offset + 2] & 0x80 ? 0xff : 0x00;
            return int32View[0] * positionScale;
        };
        let byteOffset = 16;
        const position = new Float32Array(buffer);
        const scale = new Float32Array(buffer);
        const rgba = new Uint8ClampedArray(buffer);
        const rot = new Uint8ClampedArray(buffer);
        // positions
        for (let i = 0; i < splatCount; i++) {
            position[i * 8 + 0] = read24bComponent(ubuf, byteOffset + 0);
            position[i * 8 + 1] = read24bComponent(ubuf, byteOffset + 3);
            position[i * 8 + 2] = read24bComponent(ubuf, byteOffset + 6);
            byteOffset += 9;
        }
        // colors
        const SH_C0 = 0.282;
        for (let i = 0; i < splatCount; i++) {
            for (let component = 0; component < 3; component++) {
                const byteValue = ubuf[byteOffset + splatCount + i * 3 + component];
                // 0.15 is hard coded value from spz
                // Scale factor for DC color components. To convert to RGB, we should multiply by 0.282, but it can
                // be useful to represent base colors that are out of range if the higher spherical harmonics bands
                // bring them back into range so we multiply by a smaller value.
                const value = (byteValue - 127.5) / (0.15 * 255);
                rgba[i * 32 + 24 + component] = Scalar.Clamp((0.5 + SH_C0 * value) * 255, 0, 255);
            }
            rgba[i * 32 + 24 + 3] = ubuf[byteOffset + i];
        }
        byteOffset += splatCount * 4;
        // scales
        for (let i = 0; i < splatCount; i++) {
            scale[i * 8 + 3 + 0] = Math.exp(ubuf[byteOffset + 0] / 16.0 - 10.0);
            scale[i * 8 + 3 + 1] = Math.exp(ubuf[byteOffset + 1] / 16.0 - 10.0);
            scale[i * 8 + 3 + 2] = Math.exp(ubuf[byteOffset + 2] / 16.0 - 10.0);
            byteOffset += 3;
        }
        // convert quaternion
        for (let i = 0; i < splatCount; i++) {
            const x = ubuf[byteOffset + 0];
            const y = ubuf[byteOffset + 1];
            const z = ubuf[byteOffset + 2];
            const nx = x / 127.5 - 1;
            const ny = y / 127.5 - 1;
            const nz = z / 127.5 - 1;
            rot[i * 32 + 28 + 1] = x;
            rot[i * 32 + 28 + 2] = y;
            rot[i * 32 + 28 + 3] = z;
            const v = 1 - (nx * nx + ny * ny + nz * nz);
            rot[i * 32 + 28 + 0] = 127.5 + Math.sqrt(v < 0 ? 0 : v) * 127.5;
            byteOffset += 3;
        }
        //SH
        if (shDegree) {
            // shVectorCount is : 3 for dim = 1, 8 for dim = 2 and 15 for dim = 3
            // number of vec3 vector needed per splat
            const shVectorCount = (shDegree + 1) * (shDegree + 1) - 1; // minus 1 because sh0 is color
            // number of component values : 3 per vector3 (45)
            const shComponentCount = shVectorCount * 3;
            const textureCount = Math.ceil(shComponentCount / 16); // 4 components can be stored per texture, 4 sh per component
            let shIndexRead = byteOffset;
            // sh is an array of uint8array that will be used to create sh textures
            const sh = [];
            const engine = scene.getEngine();
            const width = engine.getCaps().maxTextureSize;
            const height = Math.ceil(splatCount / width);
            // create array for the number of textures needed.
            for (let textureIndex = 0; textureIndex < textureCount; textureIndex++) {
                const texture = new Uint8Array(height * width * 4 * 4); // 4 components per texture, 4 sh per component
                sh.push(texture);
            }
            for (let i = 0; i < splatCount; i++) {
                for (let shIndexWrite = 0; shIndexWrite < shComponentCount; shIndexWrite++) {
                    const shValue = ubuf[shIndexRead++];
                    const textureIndex = Math.floor(shIndexWrite / 16);
                    const shArray = sh[textureIndex];
                    const byteIndexInTexture = shIndexWrite % 16; // [0..15]
                    const offsetPerSplat = i * 16; // 16 sh values per texture per splat.
                    shArray[byteIndexInTexture + offsetPerSplat] = shValue;
                }
            }
            return new Promise((resolve) => {
                resolve({ mode: 0 /* Mode.Splat */, data: buffer, hasVertexColors: false, sh: sh });
            });
        }
        return new Promise((resolve) => {
            resolve({ mode: 0 /* Mode.Splat */, data: buffer, hasVertexColors: false });
        });
    }
    _parse(meshesNames, scene, data, rootUrl) {
        const babylonMeshesArray = []; //The mesh for babylon
        const readableStream = new ReadableStream({
            start(controller) {
                controller.enqueue(new Uint8Array(data)); // Enqueue the ArrayBuffer as a Uint8Array
                controller.close();
            },
        });
        // Use GZip DecompressionStream
        const decompressionStream = new DecompressionStream("gzip");
        const decompressedStream = readableStream.pipeThrough(decompressionStream);
        return new Promise((resolve) => {
            new Response(decompressedStream)
                .arrayBuffer()
                .then((buffer) => {
                this._parseSPZ(buffer, scene).then((parsedSPZ) => {
                    const gaussianSplatting = new GaussianSplattingMesh("GaussianSplatting", null, scene, this._loadingOptions.keepInRam);
                    gaussianSplatting._parentContainer = this._assetContainer;
                    babylonMeshesArray.push(gaussianSplatting);
                    gaussianSplatting.updateData(parsedSPZ.data, parsedSPZ.sh);
                });
                resolve(babylonMeshesArray);
            })
                .catch(() => {
                // Catch any decompression errors
                SPLATFileLoader._ConvertPLYToSplat(data).then(async (parsedPLY) => {
                    switch (parsedPLY.mode) {
                        case 0 /* Mode.Splat */:
                            {
                                const gaussianSplatting = new GaussianSplattingMesh("GaussianSplatting", null, scene, this._loadingOptions.keepInRam);
                                gaussianSplatting._parentContainer = this._assetContainer;
                                babylonMeshesArray.push(gaussianSplatting);
                                gaussianSplatting.updateData(parsedPLY.data);
                            }
                            break;
                        case 1 /* Mode.PointCloud */:
                            {
                                const pointcloud = new PointsCloudSystem("PointCloud", 1, scene);
                                if (SPLATFileLoader._BuildPointCloud(pointcloud, parsedPLY.data)) {
                                    await pointcloud.buildMeshAsync().then((mesh) => {
                                        babylonMeshesArray.push(mesh);
                                    });
                                }
                                else {
                                    pointcloud.dispose();
                                }
                            }
                            break;
                        case 2 /* Mode.Mesh */:
                            {
                                if (parsedPLY.faces) {
                                    babylonMeshesArray.push(SPLATFileLoader._BuildMesh(scene, parsedPLY));
                                }
                                else {
                                    throw new Error("PLY mesh doesn't contain face informations.");
                                }
                            }
                            break;
                        default:
                            throw new Error("Unsupported Splat mode");
                    }
                    resolve(babylonMeshesArray);
                });
            });
        });
    }
    /**
     * Load into an asset container.
     * @param scene The scene to load into
     * @param data The data to import
     * @param rootUrl The root url for scene and resources
     * @returns The loaded asset container
     */
    loadAssetContainerAsync(scene, data, rootUrl) {
        const container = new AssetContainer(scene);
        this._assetContainer = container;
        return this.importMeshAsync(null, scene, data, rootUrl)
            .then((result) => {
            result.meshes.forEach((mesh) => container.meshes.push(mesh));
            // mesh material will be null before 1st rendered frame.
            this._assetContainer = null;
            return container;
        })
            .catch((ex) => {
            this._assetContainer = null;
            throw ex;
        });
    }
    /**
     * Imports all objects from the loaded OBJ data and adds them to the scene
     * @param scene the scene the objects should be added to
     * @param data the OBJ data to load
     * @param rootUrl root url to load from
     * @returns a promise which completes when objects have been loaded to the scene
     */
    loadAsync(scene, data, rootUrl) {
        //Get the 3D model
        return this.importMeshAsync(null, scene, data, rootUrl).then(() => {
            // return void
        });
    }
    /**
     * Code from https://github.com/dylanebert/gsplat.js/blob/main/src/loaders/PLYLoader.ts Under MIT license
     * Converts a .ply data array buffer to splat
     * if data array buffer is not ply, returns the original buffer
     * @param data the .ply data to load
     * @returns the loaded splat buffer
     */
    static _ConvertPLYToSplat(data) {
        const ubuf = new Uint8Array(data);
        const header = new TextDecoder().decode(ubuf.slice(0, 1024 * 10));
        const headerEnd = "end_header\n";
        const headerEndIndex = header.indexOf(headerEnd);
        if (headerEndIndex < 0 || !header) {
            // standard splat
            return new Promise((resolve) => {
                resolve({ mode: 0 /* Mode.Splat */, data: data });
            });
        }
        const vertexCount = parseInt(/element vertex (\d+)\n/.exec(header)[1]);
        const faceElement = /element face (\d+)\n/.exec(header);
        let faceCount = 0;
        if (faceElement) {
            faceCount = parseInt(faceElement[1]);
        }
        const chunkElement = /element chunk (\d+)\n/.exec(header);
        let chunkCount = 0;
        if (chunkElement) {
            chunkCount = parseInt(chunkElement[1]);
        }
        let rowVertexOffset = 0;
        let rowChunkOffset = 0;
        const offsets = {
            double: 8,
            int: 4,
            uint: 4,
            float: 4,
            short: 2,
            ushort: 2,
            uchar: 1,
            list: 0,
        };
        let ElementMode;
        (function (ElementMode) {
            ElementMode[ElementMode["Vertex"] = 0] = "Vertex";
            ElementMode[ElementMode["Chunk"] = 1] = "Chunk";
        })(ElementMode || (ElementMode = {}));
        let chunkMode = 1 /* ElementMode.Chunk */;
        const vertexProperties = [];
        const filtered = header.slice(0, headerEndIndex).split("\n");
        for (const prop of filtered) {
            if (prop.startsWith("property ")) {
                const [, type, name] = prop.split(" ");
                if (chunkMode == 1 /* ElementMode.Chunk */) {
                    rowChunkOffset += offsets[type];
                }
                else if (chunkMode == 0 /* ElementMode.Vertex */) {
                    vertexProperties.push({ name, type, offset: rowVertexOffset });
                    rowVertexOffset += offsets[type];
                }
                if (!offsets[type]) {
                    Logger.Warn(`Unsupported property type: ${type}.`);
                }
            }
            else if (prop.startsWith("element ")) {
                const [, type] = prop.split(" ");
                if (type == "chunk") {
                    chunkMode = 1 /* ElementMode.Chunk */;
                }
                else if (type == "vertex") {
                    chunkMode = 0 /* ElementMode.Vertex */;
                }
            }
        }
        const rowVertexLength = rowVertexOffset;
        const rowChunkLength = rowChunkOffset;
        return GaussianSplattingMesh.ConvertPLYWithSHToSplatAsync(data).then((splatsData) => {
            const dataView = new DataView(data, headerEndIndex + headerEnd.length);
            let offset = rowChunkLength * chunkCount + rowVertexLength * vertexCount;
            // faces
            const faces = [];
            if (faceCount) {
                for (let i = 0; i < faceCount; i++) {
                    const faceVertexCount = dataView.getUint8(offset);
                    if (faceVertexCount != 3) {
                        continue; // only support triangles
                    }
                    offset += 1;
                    for (let j = 0; j < faceVertexCount; j++) {
                        const vertexIndex = dataView.getUint32(offset + (2 - j) * 4, true); // change face winding
                        faces.push(vertexIndex);
                    }
                    offset += 12;
                }
            }
            // early exit for chunked/quantized ply
            if (chunkCount) {
                return new Promise((resolve) => {
                    resolve({ mode: 0 /* Mode.Splat */, data: splatsData.buffer, sh: splatsData.sh, faces: faces, hasVertexColors: false });
                });
            }
            // count available properties. if all necessary are present then it's a splat. Otherwise, it's a point cloud
            // if faces are found, then it's a standard mesh
            let propertyCount = 0;
            let propertyColorCount = 0;
            const splatProperties = ["x", "y", "z", "scale_0", "scale_1", "scale_2", "opacity", "rot_0", "rot_1", "rot_2", "rot_3"];
            const splatColorProperties = ["red", "green", "blue", "f_dc_0", "f_dc_1", "f_dc_2"];
            for (let propertyIndex = 0; propertyIndex < vertexProperties.length; propertyIndex++) {
                const property = vertexProperties[propertyIndex];
                if (splatProperties.includes(property.name)) {
                    propertyCount++;
                }
                if (splatColorProperties.includes(property.name)) {
                    propertyColorCount++;
                }
            }
            const hasMandatoryProperties = propertyCount == splatProperties.length && propertyColorCount == 3;
            const currentMode = faceCount ? 2 /* Mode.Mesh */ : hasMandatoryProperties ? 0 /* Mode.Splat */ : 1 /* Mode.PointCloud */;
            // parsed ready ready to be used as a splat
            return new Promise((resolve) => {
                resolve({ mode: currentMode, data: splatsData.buffer, sh: splatsData.sh, faces: faces, hasVertexColors: !!propertyColorCount });
            });
        });
    }
}
SPLATFileLoader._DefaultLoadingOptions = {
    keepInRam: false,
};
// Add this loader into the register plugin
registerSceneLoaderPlugin(new SPLATFileLoader());

export { index$1 as GLTF1, index as GLTF2, GLTFFileLoader, GLTFLoaderAnimationStartMode, GLTFLoaderCoordinateSystemMode, GLTFLoaderState, GLTFValidation, MTLFileLoader, OBJFileLoader, SPLATFileLoader, STLFileLoader, SolidParser };
