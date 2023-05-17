// kakao api에서 가져온 코드

var mapContainer = document.getElementById('map'), // 지도를 표시할 div
    mapOption = {
        center: new kakao.maps.LatLng(37.54, 126.96), // 지도의 중심좌표
        level: 8 // 지도의 확대 레벨
    };

var map = new kakao.maps.Map(mapContainer, mapOption); // 지도를 생성합니다

// 일반 지도와 스카이뷰로 지도 타입을 전환할 수 있는 지도타입 컨트롤을 생성합니다
var mapTypeControl = new kakao.maps.MapTypeControl();

// 지도에 컨트롤을 추가해야 지도위에 표시됩니다
// kakao.maps.ControlPosition은 컨트롤이 표시될 위치를 정의하는데 TOPRIGHT는 오른쪽 위를 의미합니다
map.addControl(mapTypeControl, kakao.maps.ControlPosition.TOPRIGHT);

// 지도 확대 축소를 제어할 수 있는  줌 컨트롤을 생성합니다
var zoomControl = new kakao.maps.ZoomControl();
map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);

/*
**********************************************************
2. 더미데이터 준비하기 (제목, 주소, url, 카테고리)
*/
const dataSet = [
    {
        title: "희락돈까스",
        address: "서울 영등포구 양산로 210",
        url: "https://www.youtube.com/watch?v=1YOJbOUR4vw&t=88s",
        category: "양식",
        content: '<div>카카오</div>',
    },
    {
        title: "즉석우동짜장",
        address: "서울 영등포구 대방천로 260",
        url: "https://www.youtube.com/watch?v=1YOJbOUR4vw&t=88s",
        category: "한식",
        content: '<div>뿅</div>',
    },
    {
        title: "경지아리움",
        address: "강동구 천호동 197-1",
        url: "https://www.youtube.com/watch?v=1YOJbOUR4vw&t=88s",
        category: "일식",
        content: '<div>이자영</div>',
    },
];

// 주소-좌표 변환 객체를 생성합니다
var geocoder = new kakao.maps.services.Geocoder();

async function setMap(dataSet) {
    for (var i = 0; i < dataSet.length; i++) {
        let coords = await getCoordsByAddress(dataSet[i].address);
        // 마커를 생성합니다
        var marker = new kakao.maps.Marker({
            map: map, // 마커를 표시할 지도
            position: coords, // 마커를 표시할 위치
        });

        markerArray.push(marker);

        // 마커에 표시할 인포윈도우를 생성합니다
        var infowindow = new kakao.maps.InfoWindow({
            content: getContentWithImage(dataSet[i]), // 인포윈도우에 표시할 내용
        });

        infowinswoArray.push(infowindow);

        updateContentAsync(infowindow, dataSet[i]);
        kakao.maps.event.addListener(marker, 'click', makeOverListener(map, marker, infowindow, coords));
        kakao.maps.event.addListener(map, 'click', makeOutListener(infowindow));
        // kakao.maps.event.addListener(marker, 'click', makeClickListener(map, marker, infowindow));
    }
}


// 주소를 좌표로 변환하는 함수
function getCoordsByAddress(address) {
    return new Promise(function (resolve, reject) {
        geocoder.addressSearch(
            address,
            function (result, status) {
                // 정상적으로 검색이 완료됐으면
                if (status === kakao.maps.services.Status.OK) {
                    var coords = new kakao.maps.LatLng(result[0].y, result[0].x);
                    resolve(coords);
                    return;
                }
                reject(status);
            });
    });
}

setMap(dataSet);

// 인포윈도우를 표시하는 클로저를 만드는 함수입니다
function makeOverListener(map, marker, infowindow, coords) {
    return function () {
        // 1. 클릭시 다른 인포윈도우 닫기
        closeInfowindow();
        infowindow.open(map, marker);
        // 2. 지도 중심으로 부드럽기 이동
        map.panTo(coords);
    };
}

let infowinswoArray = [];

function closeInfowindow() {
    for (var i = 0; i < infowinswoArray.length; i++) {
        infowinswoArray[i].close();
    }
}

// 인포윈도우를 닫는 클로저를 만드는 함수입니다
function makeOutListener(infowindow) {
    return function () {
        infowindow.close();
    };
}

// Global variable to store the currently open InfoWindow
var currentInfowindow = null;

function makeClickListener(map, marker, infowindow) {
    return function () {
        // If there is an open InfoWindow, close it
        if (currentInfowindow) {
            currentInfowindow.close();
        }

        // If the clicked InfoWindow is already open, set the currentInfowindow to null
        if (infowindow.getMap()) {
            infowindow.close();
            currentInfowindow = null;
        } else {
            // Open the clicked InfoWindow and set it as the currentInfowindow
            infowindow.open(map, marker);
            currentInfowindow = infowindow;
        }
    };
}

async function updateContentAsync(infowindow, data) {
    const imageUrl = await getImageUrl(data.title);
    const content = getContentWithImage(data, imageUrl);
    infowindow.setContent(content);
}

async function getImageUrl(searchQuery) {
    const apiKey = "AIzaSyChh59v38yHD5XuDvOkZJeLnIDQxLbsidg";
    const searchEngineId = "0340a7d6ac7684d11";
    const endpoint = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(searchQuery)}&num=2&searchType=image&key=${apiKey}&cx=${searchEngineId}`;

    const response = await fetch(endpoint, {
        method: "GET",
    });

    const data = await response.json();

    console.log(data);

    if (data.items && data.items.length > 0) {
        return data.items[0].link;
    }

    // Fallback image URL in case the API does not return any results
    return "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png";
}


function getContentWithImage(data, imageUrl) {
    return `
        <div class="infowindow-wrap">
            <div class="infowindow-info">
                <div class="infowindow-title">
                    ${data.title}
                </div>
                <div class="infowindow-img">
                    <img src="${imageUrl}" width="73" height="70">
                </div>
                <div class="infowindow-body">
                    <div class="infowindow-desc">
                        <div class="infowindow-ellipsis">${data.address}</div>
                        <div><a href="${data.url}" target="_blank" class="infowindow-link">유튜브</a></div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// 카테고리
const categoryMap = {
  korea: "한식",
  china: "중식",
  japan: "일식",
  america: "양식",
  wheat: "분식",
  meat: "구이",
  sushi: "회/초밥",
  etc: "기타",
};

const categoryList = document.querySelector(".category-list");
categoryList.addEventListener("click", categoryHandler);
function categoryHandler(event) {
    console.log(event.target.id);
    const categoryId = event.target.id;
    const category = categoryMap[categoryId];
    // 데이터 분류
    let categorizedDataSet = [];
    for (let data of dataSet) {
        if (data.category === category) {
            categorizedDataSet.push(data);
        }
    }

    // 기존 마커 삭제
    closeMarkers();

    // 기존 인포윈도우 삭제
    closeInfowindow();

    setMap(categorizedDataSet);
}

let markerArray = [];
function closeMarkers() {
    for (let marker of markerArray) {
        marker.setMap(null);
    }
}

// var container = document.getElementById('map'); //지도를 담을 영역의 DOM 레퍼런스
// var options = { //지도를 생성할 때 필요한 기본 옵션
//     center: new kakao.maps.LatLng(33.450701, 126.570667), //지도의 중심좌표.
//     level: 3 //지도의 레벨(확대, 축소 정도)
// };
//
// var map = new kakao.maps.Map(container, options); //지도 생성 및 객체 리턴