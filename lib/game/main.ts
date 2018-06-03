import impact from '../impact/impact';
import system from '../impact/system';
import game from '../impact/game';
import font from '../impact/font';

const canvas = document.getElementById('canvas');

function main() {}

const options = {
  width: 800,
  height: 450,
  scale: 1,
};

impact(canvas, main, options);
