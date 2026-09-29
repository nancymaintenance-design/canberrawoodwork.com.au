const image = (src, alt, width, height) => ({ src, alt, width, height });

export const homeCaseMedia = {
  hero: image('/assets/carpenter-at-work-canberra.webp', 'Carpenter preparing timber on a Canberra residential work site', 1440, 810),
  deck: image('/assets/completed-timber-deck-canberra.webp', 'Completed timber deck at a Canberra home', 1440, 810),
};

export const serviceCaseMedia = {
  'door-and-frame-repairs': {
    images: [
      image('/assets/timber-door-frame-repair-canberra.webp', 'Timber entry door and frame at a Canberra home', 1440, 810),
      image('/assets/door-hinge-frame-detail-canberra.webp', 'Close view of a timber door hinge and frame', 960, 720),
    ],
  },
  'timber-window-repairs': {
    images: [
      image('/assets/timber-window-repair-canberra.webp', 'Painted timber window and sill at a Canberra home', 1440, 810),
      image('/assets/timber-window-sill-detail-canberra.webp', 'Close view of a painted timber window sill in wet weather', 960, 720),
    ],
  },
  'rotten-timber-repairs': {
    images: [
      image('/assets/timber-rot-removal-canberra.webp', 'Carpenter removing damaged timber from exterior cladding', 1440, 960),
      image('/assets/repaired-timber-detail-canberra.webp', 'Close view of a finished painted timber window detail', 960, 720),
    ],
  },
  'deck-repairs': {
    images: [
      image('/assets/completed-timber-deck-canberra.webp', 'Completed timber deck at a Canberra home', 1440, 810),
      image('/assets/timber-deck-detail-canberra.webp', 'Close view of timber deck boards, edge trim and fixings', 960, 720),
    ],
  },
  'timber-fence-repairs': {
    images: [
      image('/assets/timber-fence-gate-canberra.webp', 'Timber boundary fence and gate at a Canberra home', 1440, 810),
    ],
  },
  'timber-gate-repairs': {
    images: [
      image('/assets/timber-fence-gate-canberra.webp', 'Timber boundary gate and fence at a Canberra home', 1440, 810),
    ],
  },
};
