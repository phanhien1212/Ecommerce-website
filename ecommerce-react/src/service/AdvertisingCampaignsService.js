import httpAxios from "../httpAxios";

function addAd_Campaign(data) {
  return httpAxios.post("advertisingCampaign", data);
}
function addAd_Performance(data) {
  return httpAxios.post("advertisingPerformance", data);
}
function updateClicks(ad_id) {
  return httpAxios.put(`advertisingCampaigns/increaseClicks/${ad_id}`);
}
function updateViews(data) {
  return httpAxios.put(`advertisingCampaigns/increaseViews`, data);
}
function getAd(sellerId) {
  return httpAxios.get(`advertising_compaigns/${sellerId}`);
}
function getAvenueAd(sellerId) {
  return httpAxios.get(`orderdetails/getADOrdersSummaryBySellerId/${sellerId}`);
}
function Ad_search(keyword) {
  return httpAxios.get(`/advertisingCampaign/search`, {
    params: {
      keyword: keyword,
    },
  });
}

const AdvertisingCampaignService = {
  addAd_Campaign: addAd_Campaign,
  getAd: getAd,
  getAvenueAd: getAvenueAd,
  updateClicks: updateClicks,
  updateViews: updateViews,
  addAd_Performance: addAd_Performance,
  Ad_search: Ad_search,
};
export default AdvertisingCampaignService;
