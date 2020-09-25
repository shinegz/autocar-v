//加载地图
// 定义关键帧
var keyFrames = [
    {
        // 113.401534,23.039686
        center: new BMapGL.Point(113.403205,23.044483),
        zoom:30,
        tilt: 90,
        heading: 180,
        percentage: 0
    },
    {
        // 113.401642,23.039744
        center: new BMapGL.Point(113.403187,23.044246),
        zoom: 30,
        tilt: 90,
        heading: 180,
        percentage: 0.1
    },
    {
        // 113.401745,23.039802
        center: new BMapGL.Point(113.403169,23.044025),
        zoom:21,
        tilt: 90,
        heading: 180,
        percentage: 0.25
    },
    {
        // 113.401862,23.03986
        center: new BMapGL.Point(113.403133,23.043676),
        zoom:21,
        tilt: 90,
        heading: 180,
        percentage: 0.35
    },
    {
        // 113.402019,23.039943
        center: new BMapGL.Point(113.403115,23.043435),
        zoom: 21,
        tilt:90,
        heading: 180,
        percentage: 0.45
    },
    {
        // 113.402168,23.040001
        center: new BMapGL.Point(113.403102,23.043202),
        zoom: 21,
        tilt: 90,
        heading: 180,
        percentage: 0.55
    },
    {
        // 113.402329,23.040064
        center: new BMapGL.Point(113.40312,23.042645),
        zoom:21,
        tilt: 90,
        heading: 180,
        percentage: 0.75
    },
    {
        // 113.402388,23.040093
        center: new BMapGL.Point(113.403129,23.042388),
        zoom:21,
        tilt: 90,
        heading: 180,
        percentage: 0.85
    },
    {
        // 113.402527,23.040151
        center: new BMapGL.Point(113.403133,23.042196),
        zoom:21,
        tilt: 90,
        heading: 180,
        percentage: 0.95
    },
    // {
    //     // 113.402527,23.040151
    //     center: new BMapGL.Point(113.402527,23.040151),
    //     zoom:20,
    //     tilt: 60,
    //     heading: -90,
    //     percentage: 1
    // },
];

var opts = {
    duration: 20000,     // 设置每次迭代动画持续时间
    delay: 1000,         // 设置动画延迟开始时间
    interation: 1       // 设置动画迭代次数
};

var lngLat = [{lng:113.403205,lat:23.044483},
    {lng:113.403187,lat:23.044246},
    {lng:113.403169,lat:23.044025},
    {lng:113.403133,lat:23.043676,},
    {lng:113.403115,lat:23.043435},
    {lng:113.403102,lat:23.043202},
    {lng:113.40312,lat:23.042645},
    {lng:113.403129,lat:23.042388},
    {lng:113.403133,lat:23.042196}]

export default function initMap(){
    // 百度地图API功能
        const map = new BMapGL.Map("map");    // 创建Map实例
        const animation = new BMapGL.ViewAnimation(keyFrames, opts);        // 初始化动画实例
        map.centerAndZoom(new BMapGL.Point(113.402927, 23.041561), 19);  // 初始化地图,设置中心点坐标和地图级别
        map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
        map.enableInertialDragging(true)   // 启用地图惯性拖拽
        map.setTrafficOn(); // 开启路况
        // map.setTrafficOff(); // 关闭路况
        //添加地图类型控件
        let navi3DCtrl = new BMapGL.NavigationControl3D();  // 添加3D控件
        map.addControl(navi3DCtrl);

        // map.startViewAnimation(animation);         // 开始播放动画
        // 从服务端请求到的数据的格式
        // {
        //     lng: 116.404,
        //     lat: 39.915,
        //     markerUrl：'',
        //     info: []
        // }
        // console.log(axios)
        // console.log(typeof axios)
        let i = 0
        window.setInterval(function(){      
           // 向服务端请求数据
           let lng = 113.402927
           let lat = 23.041561
        //    axios.get('http://192.168.0.102:3001/position')
        //         .then(function (res) {
        //             // console.log(res)
        //             if(res.status === 200){
        //                 lng = res.data.lng
        //                 lat = res.data.lat
        //             }
        //         })
        // axios.get('http://localhost:3001/position')
        //         .then(function (res) {
        //             // console.log(res)
        //             if(res.status === 200){
        //                 lng = res.data.lng
        //                 lat = res.data.lat
        //             }
        //         })
           if(i === 9) i = 0;
           let point = new BMapGL.Point(lngLat[i].lng,lngLat[i].lat)
           i++
        //    map.setCenter(point);  
           map.setHeading(-180);
	       map.setTilt(60);;      // 设置地图初始倾斜角
           map.clearOverlays()    
           addMarker(map,point, { event: 'click', cb:function(){
               alert('点我干啥')
           }});
        },2000)
    
}
    
// 编写自定义函数,用于创建标注
/**
* @param {point:坐标；cb:图标点击响应函数} 
* @return {undefined}
*/
function addMarker(map,point){
    // var myIcon = new BMapGL.Icon('../../../assets/car.png', new BMapGL.Size(23, 25), {   
//     // 指定定位位置。  
//     // 当标注显示在地图上时，其所指向的地理位置距离图标左上   
//     // 角各偏移10像素和25像素。您可以看到在本例中该位置即是  
//     // 图标中央下端的尖角位置。   
    // anchor: new BMapGL.Size(10, 25),   
//     // 设置图片偏移。  
//     // 当您需要从一幅较大的图片中截取某部分作为标注图标时，您  
//     // 需要指定大图的偏移位置，此做法与css sprites技术类似。   
    // imageOffset: new BMapGL.Size(0, 0 - 25)   // 设置图片偏移   
    // }); 
    // var marker = new BMapGL.Marker(point, { icon: myIcon }) 
    let marker = new BMapGL.Marker(point);
    map.addOverlay(marker)
    marker.addEventListener(arguments[2].event, arguments[2].cb);
}
