#!/usr/bin/env bash

OUT=ext/icons

mkdir -p "$OUT"

for SIZE in 16 32 48 96 128 256 512
do
  convert -background none -resize $SIZEx$SIZE KeePass_icon.svg "$OUT/KeePass_$SIZE.png"
done
