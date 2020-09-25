const protobuf = require('protobufjs/light');
const simWorldRoot = protobuf.Root.fromJSON(
    require('../src/proto_bundle/test.json')
);

const SimWorldMessage = simWorldRoot.lookupType("apollo.dreamview.SimulationWorld");

let message = SimWorldMessage.create({ name: '1' }); //如果plain object不符合 valid message 要求，会报错（不会对invalid value进行转换）
// let message = SimWorldMessage.fromObject({ name: 'gz' }); //如果plain object不符合对应的field type，会对属性值按照相应的规则进行转换
console.log(message)
let buffer  = SimWorldMessage.encode(message).finish();
console.log(buffer)
let decoded = SimWorldMessage.decode(buffer);
console.log(decoded)
let object = SimWorldMessage.toObject(decoded, 
    { enums: String })
console.log(object)