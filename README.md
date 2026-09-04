# Qualitative Analysis Tool

A small Nuxt application for the qualitative analysis of sparse anytime prediction for semantic segmentation.

The tool makes it possible to inspect an image at several prediction exits and compare:

- the raw input image;
- the ground-truth labels;
- the prediction produced at each exit;
- the pixel mask used for sparse convolution; and
- the block mask used for sparse convolution.

It also presents image-level statistics for each exit, including mean IoU, runtime, and sparsity when it is available.

## Example data

The repository includes three example images from the [Cityscapes dataset](https://www.cityscapes-dataset.com/) under `public/data/`. Each example contains a left camera image, its Cityscapes ground-truth label image, intermediate segmentation predictions, and sparse-convolution masks:

- `frankfurt_000000_000576`
- `frankfurt_000000_001016`
- `munster_000173_000019`

The examples come from the Cityscapes `frankfurt` and `munster` sequences. The application starts with the first Frankfurt example. Use the previous and next controls in the header to move through the available image IDs.

## Using the comparison view

Select an image thumbnail with the left mouse button to use it as the base image. Select a thumbnail with the right mouse button to use it as the overlay. When an overlay is selected, adjust its opacity with the vertical slider or the mouse wheel over the comparison area. Holding `Alt` changes the opacity in larger steps.

The results are grouped by exit:

- `Exit 1` through `Exit 4` show the intermediate segmentation predictions.
- Pixel masks and block masks are shown for exits 2 through 4 in the current dataset.
- The statistics section compares the selected image with the min/max/mean values calculated over all loaded images for each exit.

## Requirements

- Node.js compatible with the installed Nuxt version
- `pnpm` 11 or newer

## Setup

Install the dependencies:

```bash
pnpm install
```

Start the development server at `http://localhost:3000`:

```bash
pnpm dev
```

Other useful commands:

```bash
pnpm lint       # Run ESLint
pnpm typecheck  # Run Nuxt/Vue TypeScript checks
pnpm build      # Build for production
pnpm preview    # Preview the production build locally
```

## Data format

Results are loaded from `public/data/results.json`. The top-level keys must match the image directory names. Each image contains one object per prediction exit and the following metrics:

```json
{
  "image_id": {
    "exit1": {
      "time_s": 0.145,
      "mean_IoU": 0.352,
      "pixel_acc": 0.936,
      "mean_acc": 0.388
    },
    "exit2": {
      "time_s": 0.291,
      "mean_IoU": 0.497,
      "pixel_acc": 0.970,
      "mean_acc": 0.540,
      "sparsity": 0.188
    },
    "exit3": {
      "time_s": 0.711,
      "mean_IoU": 0.715,
      "pixel_acc": 0.985,
      "mean_acc": 0.763,
      "sparsity": 0.421
    },
    "exit4": {
      "time_s": 1.105,
      "mean_IoU": 0.728,
      "pixel_acc": 0.986,
      "mean_acc": 0.780,
      "sparsity": 0.671
    }
  }
}
```

`sparsity` is optional in the input data. Missing values are treated as `0` by the application; the bundled examples omit it for `exit1`.

For each image directory, the current UI expects these files:

```text
leftImg8bit.png
gtFine_color.png
exit1_prediction.png
exit2_prediction.png
exit3_prediction.png
exit4_prediction.png
exit2_pixel_mask.png
exit3_pixel_mask.png
exit4_pixel_mask.png
exit2_block_mask.png
exit3_block_mask.png
exit4_block_mask.png
```

The paths are currently constructed directly in `app/app.vue`, so adding new images requires following this naming convention and adding the corresponding result entry. The application is not yet a general-purpose dataset importer.

## Project structure

```text
app/
  app.vue                         Main comparison view and interactions
  components/                     Image previews, comparison, and statistics
  composables/stores/ResultsStore.ts
                                  Loads results.json and calculates aggregate metrics
public/data/
  results.json                    Image-level metrics
  <image-id>/                     Input, labels, predictions, and sparse masks
```

## Current limitations and future improvements

The current implementation is intentionally focused on the included examples and has several hard-coded assumptions: four exits, fixed file names, one results file, and one active configuration. The class statistics panel is present in the layout but is not implemented yet.

Planned improvements:

- add per-class statistics;
- compare different model or sparse-convolution configurations;
- make the number of exits and available mask types data-driven;
- replace the hard-coded asset paths with a reusable dataset/configuration format.
