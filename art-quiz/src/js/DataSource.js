class DataSource {
  async loadData() {
    this.structureData = await this.getJsonData("js/structure.json");
    this.factsData = await this.getJsonData("js/images.json");
  }

  async getJsonData(path) {
    const response = await fetch(path);
    const data = await response.json();
    return data;
  }

  getKey(kindData, groupData) {
    let kindIndex = this.structureData.indexOf(kindData);
    let groupIndex = kindData.groups.indexOf(groupData);
    let key = `${kindIndex}_${groupIndex}`;
    
    return key;
  }
}

export default DataSource;
