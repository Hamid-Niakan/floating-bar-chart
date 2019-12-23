/**
 * ---------------------------------------
 * This demo was created using amCharts 4.
 * 
 * For more information visit:
 * https://www.amcharts.com/
 * 
 * Documentation is available at:
 * https://www.amcharts.com/docs/v4/
 * ---------------------------------------
 */

//---------- Themes begin
am4core.useTheme(am4themes_animated);
//---------- Themes end

var chart = am4core.create("chartdiv", am4charts.XYChart);

chart.data = [{
    "id": 1,
    "session": "جلسه یک",
    "startTime": 0,
    "endTime": 7,
    "color": chart.colors.next(),
    "title": "درس اول"
}, {
    "id": 2,
    "session": "جلسه دو",
    "startTime": 7,
    "endTime": 14,
    "color": chart.colors.next(),
    "title": "درس دوم"
}, {
    "id": 3,
    "session": "جلسه سه",
    "startTime": 14,
    "endTime": 25,
    "color": chart.colors.next(),
    "title": "درس سوم"
}, {
    "id": 4,
    "session": "جلسه چهار",
    "startTime": 15,
    "endTime": 19,
    "color": chart.colors.next(),
    "title": "درس چهارم"
}];

const dataArr = [...chart.data];

var restrict = true;

chart.padding(40, 40, 0, 0);
chart.maskBullets = false; // allow bullets to go out of plot area

chart.scrollbarX = new am4core.Scrollbar();
chart.scrollbarY = new am4core.Scrollbar();

//---------- category axis
var categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
categoryAxis.dataFields.category = "session";
categoryAxis.renderer.inversed = false;
categoryAxis.renderer.grid.template.location = 0;
categoryAxis.renderer.cellStartLocation = 0.1;
categoryAxis.renderer.cellEndLocation = 0.9;

//---------- value axis
var valueAxis = chart.xAxes.push(new am4charts.ValueAxis());
// we set fixed min/max and strictMinMax to true, as otherwise value axis will adjust min/max while dragging and it won't look smooth
valueAxis.strictMinMax = true;
valueAxis.min = 0;
valueAxis.max = 30;
valueAxis.renderer.minGridDistance = 100;

//---------- separating each week visually on the chart
function createRange(from, to, label, color) {
    let range = valueAxis.axisRanges.create();
    range.value = from;
    range.endValue = to;
    range.label.text = label;
    range.label.paddingTop = 40;
    range.label.location = 0.5;
    range.label.horizontalCenter = "middle";
    range.label.fontWeight = "bolder";
    range.grid.disabled = true;
    range.axisFill.fill = am4core.color(color);
    range.axisFill.fillOpacity = 0.2;
    range.grid.strokeOpacity = 0;
}

function autoRange(num) {
    const weekNo = Math.ceil(num / 7);
    for (let i = 0; i < weekNo; i++) {
        if (i % 2 === 0)
            createRange(7 * i, 7 * i + 7, `هفته ${i + 1}`, "#396478");
        else
            createRange(7 * i, 7 * i + 7, `هفته ${i + 1}`, "#ffffff");
    }
}

autoRange(valueAxis.max);

//---------- column series
var columnSeries = chart.series.push(new am4charts.ColumnSeries());
columnSeries.dataFields.categoryY = "session";
columnSeries.dataFields.valueX = "endTime";
columnSeries.dataFields.openValueX = "startTime";
columnSeries.sequencedInterpolation = true;
columnSeries.defaultState.interpolationDuration = 1500;
columnSeries.dataFields.title = "title";
columnSeries.columns.template.tooltipText = "[bold]{categoryY}[/]\nشروع از روز {openValueX}\nپایان به روز {valueX}\n{title}";

//---------- column template
var columnTemplate = columnSeries.columns.template;
columnTemplate.strokeOpacity = 0;
columnTemplate.propertyFields.fill = "color";
columnTemplate.height = am4core.percent(100);
columnTemplate.cursorOverStyle = am4core.MouseCursorStyle.grab;
columnTemplate.column.cornerRadiusTopRight = 8;
columnTemplate.column.cornerRadiusBottomRight = 8;
columnTemplate.column.cornerRadiusBottomLeft = 8;
columnTemplate.column.cornerRadiusTopLeft = 8;
columnTemplate.column.fillOpacity = 0.8;

//---------- label bullet
var labelBulletRight = columnSeries.bullets.push(new am4charts.LabelBullet());
labelBulletRight.label.text = "{valueX.value}";
labelBulletRight.dx = -20;

var labelBulletLeft = columnSeries.bullets.push(new am4charts.LabelBullet());
labelBulletLeft.label.text = "{openValueX.value}";
labelBulletLeft.locationX = 1;
labelBulletLeft.dx = 20;

//---------- series bullet
var circleBulletRight = columnSeries.bullets.push(new am4charts.CircleBullet());
circleBulletRight.stroke = am4core.color("#ffffff");
circleBulletRight.draggable = true;
circleBulletRight.cursorOverStyle = am4core.MouseCursorStyle.horizontalResize;

var circleBulletLeft = columnSeries.bullets.push(new am4charts.CircleBullet());
circleBulletLeft.stroke = am4core.color("#ffffff");
circleBulletLeft.draggable = true;
circleBulletLeft.cursorOverStyle = am4core.MouseCursorStyle.horizontalResize;
circleBulletLeft.locationX = 1;

var circleBulletCenter = columnSeries.bullets.push(new am4charts.CircleBullet());
circleBulletCenter.stroke = am4core.color("#ffffff");
circleBulletCenter.draggable = true;
circleBulletCenter.defaultState.properties.opacity = 0;
circleBulletCenter.locationX = 1;
circleBulletCenter.dy = 15;
let centerValue = [];
let test;

//---------- while dragging
circleBulletRight.events.on("drag", event => {
    handleDragRight(event);
});

circleBulletLeft.events.on("drag", event => {
    handleDragLeft(event);
});

circleBulletCenter.events.on("drag", event => {
    handleDragCenter(event);
});

circleBulletRight.events.on("dragstop", event => {
    handleDragRight(event);
    valueAxis.axisRanges.clear();
    autoRange(valueAxis.max);
});

circleBulletLeft.events.on("dragstop", event => {
    handleDragLeft(event);
});

circleBulletCenter.events.on("dragstop", event => {
    handleDragCenter(event);
    valueAxis.axisRanges.clear();
    autoRange(valueAxis.max);
    centerValue = [];
    test = null;
});

circleBulletCenter.events.on("click", event => {
    console.log(event);
})

function handleDragRight(event) {
    var dataItem = event.target.dataItem;
    var id = dataItem.dataContext.id;
    var bar = dataArr.find(element => element.id === id);
    // convert coordinate to value
    var value = Math.round(valueAxis.xToValue(event.target.pixelX));
    // set new value & update data array
    dataItem.valueX = bar.endTime = value;
    // hide tooltip not to interrupt
    dataItem.column.hideTooltip(0);
    // expand chart
    if (dataItem.valueX === valueAxis.max)
        valueAxis.max += 30;
    // restrictions
    if (dataItem.valueX <= dataItem.openValueX)
        dataItem.valueX = dataItem.openValueX + 1;
    if (restrict)
        restrictionResize(event, id, bar);
}

function handleDragLeft(event) {
    var dataItem = event.target.dataItem;
    var id = dataItem.dataContext.id;
    var bar = dataArr.find(element => element.id === id);
    // convert coordinate to value
    var value = Math.round(valueAxis.xToValue(event.target.pixelX));
    // set new value & update data array
    dataItem.openValueX = bar.startTime = value;
    // hide tooltip not to interrupt
    dataItem.column.hideTooltip(0);
    // restrictions
    if (dataItem.valueX <= dataItem.openValueX)
        dataItem.openValueX = dataItem.valueX - 1;
    if (restrict)
        restrictionResize(event, id, bar);
}

function handleDragCenter(event) {
    var dataItem = event.target.dataItem;
    var id = dataItem.dataContext.id;
    var bar = dataArr.find(element => element.id === id);
    // convert coordinate to value
    var value = Math.round(valueAxis.xToValue(event.target.pixelX));
    if (centerValue === [])
        centerValue.push(value);
    else if (centerValue[centerValue.length - 1] !== value) {
        centerValue.push(value);
        if (centerValue.length > 2)
            centerValue.shift();
    }

    if (centerValue.length === 2 && test !== centerValue[centerValue.length - 1]) {
        var dx = centerValue[1] - centerValue[0];
        dataItem.openValueX = bar.startTime = dataItem.openValueX + dx;
        dataItem.valueX = bar.endTime = dataItem.valueX + dx;
        test = centerValue[centerValue.length - 1];
    }
    // hide tooltip not to interrupt
    dataItem.column.hideTooltip(0);
    // expand chart
    if (dataItem.valueX === valueAxis.max)
        valueAxis.max += 30;
}

//---------- restriction
function restrictionResize(event, id, bar) {
    var dataItem = event.target.dataItem;
    var barsNo = dataArr.length;
    var beforeBar = dataArr.find(element => element.id === id - 1);
    var afterBar = dataArr.find(element => element.id === id + 1);

    if (id === 1 && dataItem.valueX > afterBar.startTime) {
        dataItem.valueX = bar.endTime = afterBar.startTime;
    } else if (id === barsNo && dataItem.openValueX < beforeBar.endTime) {
        dataItem.openValueX = bar.startTime = beforeBar.endTime;
    } else if (id !== 1 && id !== barsNo) {
        if (dataItem.openValueX < beforeBar.endTime) {
            dataItem.openValueX = bar.startTime = beforeBar.endTime;
        } else if (dataItem.valueX > afterBar.startTime) {
            dataItem.valueX = bar.endTime = afterBar.startTime;
        }
    }
}

function restrictionDrag(event, id, bar) {

}

//---------- start dragging bullet even if we hit on column not just a bullet, this will make it more friendly for touch devices
columnTemplate.events.on("down", event => {
    var dataItem = event.target.dataItem;
    var itemBullet = dataItem.bullets.getKey(circleBulletCenter.uid);
    itemBullet.dragStart(event.pointer);
});

//---------- when columns position changes, adjust minX/maxX of bullets so that we could only drag vertically
columnTemplate.events.on("positionchanged", event => {
    verticalDrag(event, circleBulletLeft);
    verticalDrag(event, circleBulletRight);
    verticalDrag(event, circleBulletCenter);
});

function verticalDrag(event, bullet) {
    var dataItem = event.target.dataItem;
    var itemBullet = dataItem.bullets.getKey(bullet.uid);

    var column = dataItem.column;
    itemBullet.minY = column.pixelY + column.pixelHeight / 2;
    itemBullet.maxY = itemBullet.minY;
    itemBullet.minX = 0;
    itemBullet.maxX = chart.seriesContainer.pixelWidth;
}

//---------- as by default columns of the same series are of the same color, we add adapter which takes colors from chart.colors color set
columnTemplate.adapter.add("fill", (fill, target) => {
    return chart.colors.getIndex(target.dataItem.index).saturate(0.3);
});

circleBulletRight.adapter.add("fill", (fill, target) => {
    return chart.colors.getIndex(target.dataItem.index).saturate(0.3);
});

circleBulletLeft.adapter.add("fill", (fill, target) => {
    return chart.colors.getIndex(target.dataItem.index).saturate(0.3);
});

circleBulletCenter.adapter.add("fill", (fill, target) => {
    return chart.colors.getIndex(target.dataItem.index).saturate(0.3);
});