//--------------------------------------
// 現在地検索用JSライブラリ
//--------------------------------------
var m_poi_code = '';	// POIコード
var cb_type = '';		// callback function
var retry = 0;

/**
 * 位置情報取得
 * @param pCocde{String}:POIコード
 * @param pName{String}:遷移ページ名
 */
function getPosition(pCode,pName){
	if(pCode != '') m_poi_code = pCode;
	if(pName != '') cb_type = pName;

	navigator.geolocation.getCurrentPosition(
		successCallBack,
		errorCallBack,
		{
			enableHighAccuracy:true		// 位置情報の精度を高くする
			,timeout:15000				// タイムアウト時間(ms)
			,maximumAge:0				// 有効期限
		}
	);
}


/* 位置情報取得 成功時のコールバック関数 */
var successCallBack = function(position){
	if(position.coords.accuracy < spConfig.m_geoAccuracy){
		var current_position = Adapter.getInstance().w2t(position.coords.longitude, position.coords.latitude);

		if(cb_type == 'kokoiku' && m_poi_code != ''){
			// ココ行く
			document.location = '/b/' + spConfig.m_layer + '/info/' + m_poi_code + '/?t=kokoiku_route&nl=' + current_position.y + '&el=' + current_position.x + spConfig.m_extends_param_spMap_and + '&uc_type=pp';
		}else if(cb_type == 'map'){
			// 地図
			document.location = '/m/' + spConfig.m_layer + '/' + current_position.y + '_' + current_position.x + '_' + spConfig.m_default_scl + '/' + spConfig.m_extends_param_spMap;
		}else if(cb_type == 'circle'){
			// 周辺検索
			document.location = '/b/' + spConfig.m_layer + '/circle/?nl=' + current_position.y + '&el=' + current_position.x + spConfig.m_extends_param_spMap_and + '&geo=1';
		}
	}else{
		retry++;
		if (retry < 10) {
			getPosition(m_poi_code,cb_type);
		}else{
			alert("現在地の取得精度が高くありませんでした。");
			retry = 0;
		}
	}
}

/* 位置情報取得 失敗時のコールバック関数 */
/* 1=位置情報の利用が許可されていない, 2=デバイスの位置が判定できない, 3=Timeout */
var errorCallBack = function(err){
	alert("現在地の取得に失敗しました。\nご使用されている端末の位置情報に関する設定をご確認ください。\n(error code:" + err.code + ")");
}
