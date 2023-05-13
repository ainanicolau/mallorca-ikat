const DIMENSIONS = {
    'a1': [7016, 9933],
    'a2': [4690, 7016],
    'a3': [3508, 4690],
    'a4': [2480, 3508],
    'a5': [1748, 2480],
}

let canvas;
let canvas_height = window.innerHeight - 100 - 63;
let canvas_width = Math.round(canvas_height / 1.41);

let shapes;
let additionalShapes;
let h_lines = 5;
let space_between_lines = 0;
let detail = false;
let invert_lines = false;
let zigzag = 1;
let zigzag_height = 30;
let noise_amount = 3;
let columns = 1;
let division_width = 20;
let division_columns = 4;
let division_column_width = 3;
let lines_color = '#254b85';
let bg_color = '#e6e6e6';
let divisions_color1 = '#254b85';
let divisions_color2 = '#254b85';

// Widgets
// General Look
let noise_amount_slider;
let columns_slider;
let invert_lines_checkbox;
let detail_checkbox;

// Main Pattern
let h_lines_slider;
let space_between_lines_slider;
let zigzag_slider;
let zigzag_height_slider;
let lines_color_picker;
let bg_color_picker;

// Divisions
let division_width_slider;
let division_columns_slider;
let division_column_width_slider;
let divisions_color1_picker;
let divisions_color2_picker;

function setup()
{
    // GENERAL LOOK
    general_look_box = createDiv();
    general_look_box.parent("parameters-container");
    general_look_box.addClass("box");
    general_look_box_title = createElement('h1', 'GENERAL LOOK');
    general_look_box_title.parent(general_look_box);

    noise_amount_label = createP('Noise Amount');
    noise_amount_label.parent(general_look_box)
    noise_amount_slider = createSlider(0, 20, noise_amount);
    noise_amount_slider.input(on_noise_amount_changed);
    noise_amount_slider.parent(general_look_box)

    columns_label = createP('Columns');
    columns_label.parent(general_look_box)
    columns_slider = createSlider(1, 10, columns);
    columns_slider.input(on_columns_changed);
    columns_slider.parent(general_look_box)

    effects_group = createDiv();
    effects_group.parent(general_look_box);
    effects_group.addClass("group");

    invert_lines_label = createP('Invert Lines');
    invert_lines_label.parent(effects_group)
    invert_lines_checkbox = createCheckbox();
    invert_lines_checkbox.input(on_invert_lines_checkbox_checked);
    invert_lines_checkbox.parent(effects_group)

    detail_label = createP('Add detail');
    detail_label.parent(effects_group)
    detail_checkbox = createCheckbox();
    detail_checkbox.input(on_detail_checkbox_checked);
    detail_checkbox.parent(effects_group)

    // MAIN PATTERN
    main_pattern_box = createDiv();
    main_pattern_box.parent("parameters-container");
    main_pattern_box.addClass("box");
    main_pattern_box_title = createElement('h1', 'MAIN PATTERN');
    main_pattern_box_title.parent(main_pattern_box);

    lines_label_group = createDiv();
    lines_label_group.parent(main_pattern_box);
    lines_label_group.addClass("group");

    lines_slider_group = createDiv();
    lines_slider_group.parent(main_pattern_box);
    lines_slider_group.addClass("group");

    h_lines_label = createP('Horizontal Lines');
    h_lines_label.parent(lines_label_group)
    h_lines_slider = createSlider(3, 10, h_lines);
    h_lines_slider.input(on_h_lines_changed);
    h_lines_slider.parent(lines_slider_group)

    space_between_lines_label = createP('Space Between Lines');
    space_between_lines_label.parent(lines_label_group)
    space_between_lines_slider = createSlider(0, canvas_height / (h_lines *
        2 - 1), space_between_lines);
    space_between_lines_slider.input(on_space_between_lines_changed);
    space_between_lines_slider.parent(lines_slider_group)

    zigzag_label_group = createDiv();
    zigzag_label_group.parent(main_pattern_box);
    zigzag_label_group.addClass("group");

    zigzag_slider_group = createDiv();
    zigzag_slider_group.parent(main_pattern_box);
    zigzag_slider_group.addClass("group");

    zigzag_label = createP('Zigzag Peaks');
    zigzag_label.parent(zigzag_label_group)
    zigzag_slider = createSlider(0, 10, zigzag);
    zigzag_slider.input(on_zigzag_changed);
    zigzag_slider.parent(zigzag_slider_group)

    zigzag_height_label = createP('Zigzag Height');
    zigzag_height_label.parent(zigzag_label_group)
    zigzag_height_slider = createSlider(20, 80, zigzag_height);
    zigzag_height_slider.input(on_zigzag_height_changed);
    zigzag_height_slider.parent(zigzag_slider_group)

    main_colors_label_group = createDiv();
    main_colors_label_group.parent(main_pattern_box);
    main_colors_label_group.addClass("group");

    main_colors_slider_group = createDiv();
    main_colors_slider_group.parent(main_pattern_box);
    main_colors_slider_group.addClass("group");

    lines_color_label = createP('Lines Color');
    lines_color_label.parent(main_colors_label_group)
    lines_color_picker = createColorPicker(lines_color);
    lines_color_picker.input(on_lines_color_changed);
    lines_color_picker.parent(main_colors_slider_group)

    bg_color_label = createP('Background Color');
    bg_color_label.parent(main_colors_label_group)
    bg_color_picker = createColorPicker(bg_color);
    bg_color_picker.input(on_bg_color_changed);
    bg_color_picker.parent(main_colors_slider_group)

    // DIVISIONS
    divisions_box = createDiv();
    divisions_box.parent("parameters-container");
    divisions_box.addClass("box");
    divisions_box_title = createElement('h1', 'DIVISIONS');
    divisions_box_title.parent(divisions_box);

    division_width_label = createP('Division Width');
    division_width_label.parent(divisions_box)
    division_width_slider = createSlider(0, canvas_width / columns,
        division_width);
    division_width_slider.input(on_division_width_changed)
    division_width_slider.parent(divisions_box)

    division_columns_label_group = createDiv();
    division_columns_label_group.parent(divisions_box);
    division_columns_label_group.addClass("group");

    division_columns_slider_group = createDiv();
    division_columns_slider_group.parent(divisions_box);
    division_columns_slider_group.addClass("group");

    division_columns_label = createP('Division Columns');
    division_columns_label.parent(division_columns_label_group)
    division_columns_slider = createSlider(0, 6, division_columns);
    division_columns_slider.input(on_division_columns_changed);
    division_columns_slider.parent(division_columns_slider_group)

    division_column_width_label = createP('Division Column Width');
    division_column_width_label.parent(division_columns_label_group)
    division_column_width_slider = createSlider(1, 10, division_column_width);
    division_column_width_slider.input(on_division_column_width_changed);
    division_column_width_slider.parent(division_columns_slider_group)

    division_colors_label_group = createDiv();
    division_colors_label_group.parent(divisions_box);
    division_colors_label_group.addClass("group");

    division_colors_slider_group = createDiv();
    division_colors_slider_group.parent(divisions_box);
    division_colors_slider_group.addClass("group");

    divisions_color1_label = createP('Divisions Color 1');
    divisions_color1_label.parent(division_colors_label_group)
    divisions_color1_picker = createColorPicker(divisions_color1);
    divisions_color1_picker.input(on_divisions_color1_changed);
    divisions_color1_picker.parent(division_colors_slider_group)

    divisions_color2_label = createP('Divisions Color 2');
    divisions_color2_label.parent(division_colors_label_group)
    divisions_color2_picker = createColorPicker(divisions_color2);
    divisions_color2_picker.input(on_divisions_color2_changed);
    divisions_color2_picker.parent(division_colors_slider_group)

    // To guarantee an exact download resolution.
    pixelDensity(1);

    // Create Canvas
    canvas = create_canvas(canvas_width, canvas_height);

    // Update canvas with initial parameters.
    update_canvas();
}

function create_canvas(width, height)
{
    canvas = createCanvas(canvas_width, canvas_height);
    canvas.style("background", "#FFFFFF");
    canvas.style("border-radius", "50px");
    canvas.style("box-shadow", "0px 4px 30px rgba(0, 0, 0, 0.02)");
    canvas.parent("canvas-element");
}

function generateHLines(width, height, h_lines, zigzag, zigzag_height,
    noise_amount, space_between_lines, detail,
    invert_lines, img_width)
{
    let lines_height = height / (h_lines * 2 - 3);
    let segment_lenght = floor(width / (zigzag + 1));
    let shapes = [];
    let additionalShapes = [];

    for (let h_line = -1; h_line < h_lines; h_line++)
    {
        let y1 = (lines_height + space_between_lines) * 2 * h_line +
            lines_height;
        let y2 = y1 + lines_height;
        let line_upper_points = [
            [0, y1]
        ];
        let line_lower_points = [
            [0, y2]
        ];
        if (zigzag_height > 0)
        {
            let new_zigzag_height = zigzag_height
            if (invert_lines)
            {
                if (h_line % 2 == 1)
                {
                    new_zigzag_height = -zigzag_height;
                    y1 = y1 - zigzag_height;
                    y2 = y2 - zigzag_height;
                    line_upper_points = [
                        [0, y1]
                    ];
                    line_lower_points = [
                        [0, y2]
                    ];
                }
            }
            addZigZag(segment_lenght, new_zigzag_height, line_upper_points,
                line_lower_points, y1, y2, zigzag)
        }
        line_upper_points.push([width, y1]);
        line_lower_points.unshift([width, y2]);
        if (detail)
        {
            addDetail(line_upper_points, additionalShapes, lines_height,
                zigzag_height, noise_amount / 2, invert_lines, h_line,
                img_width);
        }
        calculateInterpolatedPoints(line_upper_points, line_lower_points,
            noise_amount, lines_height, img_width)
        let line_points = line_upper_points.concat(line_lower_points);
        shapes.push(line_points);
    }
    return [shapes, additionalShapes];
}

function addZigZag(segment_lenght, zigzag_height, line_upper_points,
    line_lower_points, y1, y2, zigzag)
{
    for (let edge = 0; edge < zigzag; edge++)
    {
        let x = segment_lenght * (edge + 1);
        if (edge % 2 == 0)
        {
            line_upper_points.push([x, y1 - zigzag_height]);
            line_lower_points.unshift([x, y2 - zigzag_height]);
        }
        else
        {
            line_upper_points.push([x, y1]);
            line_lower_points.unshift([x, y2]);
        }
    }
}

function addDetail(line_upper_points, additionalShapes, lines_height,
    zigzag_height, noise_amount, invert_lines, h_line,
    image_width)
{

    let width = lines_height / 5;
    let height = lines_height + zigzag_height - int(width);
    if (invert_lines)
    {
        height = lines_height / 2;
    }
    for (let peak = 1; peak < line_upper_points.length; peak = peak + 2)
    {
        let peak_index = peak
        if (invert_lines && h_line % 2 == 1)
        {
            peak_index = peak_index - 1;
        }
        let x = line_upper_points[peak_index][0] - int(width / 2);
        let y = line_upper_points[peak_index][1] + int(width);
        if (invert_lines)
        {
            y = line_upper_points[peak_index + 1][1] + height;
        }
        additional_shapes_upper = [];
        additional_shapes_lower = [];
        for (let point = 0; point < width; point = point + image_width / 400)
        {
            let noise = random(-noise_amount, noise_amount);
            additional_shapes_upper.push([x + point, y + noise]);
            additional_shapes_lower.push([x + width - point, y + noise +
                height])
        }
        let shape_points = additional_shapes_upper.concat(
            additional_shapes_lower);
        additionalShapes.push(shape_points);
    }
    return additionalShapes;
}

function calculateInterpolatedPoints(line_upper_points, line_lower_points,
    noise_amount, lines_height, img_width)
{
    for (let point = line_upper_points.length - 1; point > 0; point--)
    {
        let initial_x = line_upper_points[point][0];
        let initial_y = line_upper_points[point][1];
        let num_lines = line_upper_points[point][0] - line_upper_points[point -
            1][0];
        let height = line_upper_points[point][1] - line_upper_points[point - 1][
            1
        ];
        let segment_height = height / num_lines;
        for (let line = 1; line < num_lines; line = line + img_width / 400)
        {
            let extra = random(-noise_amount, noise_amount);
            let new_point = [initial_x - line, initial_y - segment_height *
                line + extra
            ];
            line_upper_points.splice(point, 0, new_point)
            let new_point_lower = [initial_x - line, initial_y -
                segment_height * line + extra + lines_height
            ];
            line_lower_points.splice(line_upper_points.length - 1 - point, 0,
                new_point_lower)
        }
    }
}

function drawLines(shapes, h_lines, pattern, color, ratio)
{
    pattern.fill(color);
    pattern.noStroke();
    for (let h_line = 0; h_line < h_lines; h_line++)
    {
        pattern.beginShape();
        for (let points = 0; points < shapes[h_line].length; points = points +
            ratio)
        {
            pattern.vertex(shapes[h_line][points][0], shapes[h_line][points][
            1]);
        }
        pattern.endShape(CLOSE);
    }
}

function drawAdditionalShapes(shapes, pattern, color, ratio)
{
    pattern.fill(color);
    // pattern.fill(255, 0, 0);
    pattern.noStroke();
    for (let shape = 0; shape < shapes.length; shape++)
    {
        pattern.beginShape();
        for (let points = 0; points < shapes[shape].length; points = points +
            ratio)
        {
            pattern.vertex(shapes[shape][points][0], shapes[shape][points][1]);
        }
        pattern.endShape(CLOSE);
        // pattern.rect(shapes[shape][0], shapes[shape][1],
        //              shapes[shape][2], shapes[shape][3]);
    }
}

function modifyDivision(division, width, height, columns, color1, color2,
    column_width)
{

    division.noStroke();
    let white_width = (width - columns * column_width) / (columns + 1);
    for (let column = 0; column < columns; column++)
    {
        if (columns % 2 == 1 || column >= columns / 2)
        {
            if (column % 2 == 0)
            {
                fill_color = color1
            }
            else
            {
                fill_color = color2
            }
        }
        else
        {
            if (column % 2 == 0)
            {
                fill_color = color2
            }
            else
            {
                fill_color = color1
            }

        }

        division.fill(fill_color);
        let x = (white_width + column_width) * column + white_width;
        division.rect(x, 0, column_width, height);
    }
}


function on_h_lines_changed()
{
    h_lines = this.value();
    update_canvas();
}

function on_space_between_lines_changed()
{
    space_between_lines = this.value();
    update_canvas();
}

function on_detail_checkbox_checked()
{
    detail = this.checked();
    update_canvas();
}

function on_invert_lines_checkbox_checked()
{
    invert_lines = this.checked();
    update_canvas();
}

function on_zigzag_changed()
{
    zigzag = this.value();
    update_canvas();
}

function on_zigzag_height_changed()
{
    zigzag_height = this.value();
    update_canvas();
}

function on_noise_amount_changed()
{
    noise_amount = this.value();
    update_canvas();
}

function on_columns_changed()
{
    columns = this.value();
    update_canvas();
}

function on_division_width_changed()
{
    division_width = this.value();
    update_canvas();
}

function on_division_columns_changed()
{
    division_columns = this.value();
    update_canvas();
}

function on_division_column_width_changed()
{
    division_column_width = this.value();
    update_canvas();
}

function on_lines_color_changed()
{
    lines_color = this.value();
    update_canvas();
}

function on_bg_color_changed()
{
    bg_color = this.value();
    update_canvas();
}

function on_divisions_color1_changed()
{
    divisions_color1 = this.value();
    update_canvas();
}

function on_divisions_color2_changed()
{
    divisions_color2 = this.value();
    update_canvas();
}

function download_image(format, filename)
{
    img = create_image(DIMENSIONS[format][0], DIMENSIONS[format][1]);
    save(img, filename);
}

function create_image(img_width, img_height)
{

    let img = createGraphics(img_width, img_height);

    img.background(bg_color);

    let pattern_width = (img_width - division_width / 200 * img_width * (
        columns - 1)) / columns;

    let pattern = createGraphics(pattern_width, img_height);
    if (division_width)
    {
        var division = createGraphics(division_width / 200 * img_width,
            img_height);
        division.background(bg_color);
        modifyDivision(
            division, division_width / 200 * img_width, img_height,
            division_columns,
            divisions_color1, divisions_color2, division_column_width /
            350 * img_width)
    }

    shapes = generateHLines(pattern_width, img_height, h_lines, zigzag * 2 - 1,
        zigzag_height / 200 * img_height / 1.5, noise_amount / 200 *
        img_height, space_between_lines / 200 * img_height,
        detail, invert_lines, img_width);
    drawLines(shapes[0], h_lines, pattern, lines_color, 1);

    if (detail)
    {
        drawAdditionalShapes(shapes[1], pattern, lines_color, 1);
    }

    for (var i = 0; i < columns; ++i)
    {
        img.image(pattern, i * (pattern_width + division_width / 200 *
            img_width), 0, pattern_width, img_height);
        if (division_width > 0)
        {
            img.image(
                division, (i * (pattern_width + division_width / 200 *
                    img_width)) + pattern_width, 0,
                division_width / 200 * img_width, img_height);
        }

    }

    return img;
}

function update_canvas()
{
    const img = create_image(canvas_width, canvas_height);
    image(img, 0, 0, canvas_width, canvas_height);
}

function windowResized()
{
    canvas_height = window.innerHeight - 100 - 63;
    canvas_width = Math.round(canvas_height / 1.41);
    canvas = create_canvas(canvas_width, canvas_height);
    update_canvas();
}

function download_image(format, filename)
{
    const img = create_image(DIMENSIONS[format][0], DIMENSIONS[format][1]);
    save(img, filename);
}
