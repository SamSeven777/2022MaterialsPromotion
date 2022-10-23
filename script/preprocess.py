#!/usr/bin/env python3

import os
from PIL import Image
import json

from pprint import pprint

class Symbol:
	def __init__(self, name):
		self.name = name
	
	def __repr__(self):
		return self.name


logic = [
	'进入马戏团', [
		'光滑的门', [
			'灯光秀', [
				'捡起拐杖', [
					'跟他一起', 1,
					'独自留下', 3
				],
				'不捡拐杖', 6
			],
			'音乐会', [
				'第一排', [
					'跟上去', 7, 
					'离场',8
				],
				'最后一排', 9
			]
		],
		'粗糙的门', [
			'舞蹈表演', [
				'留下', [
					'大胆上台', 10,
					'委婉拒绝', 11
				],
				'离开', 12
			],
			'魔术表演',[
				'坚持看下去', 13,
				'逃离现场', 14
			]
		]
	],
	'不进入马戏团', [
		'无心观赏', 4,
		'好奇观望', [
			'回去看看', 2,
			'继续离开', 5
		]
	]
]

button_name = 'H5/按钮/{}.png'
bg_name = 'H5/图片/{}.jpg'
txt_name = 'H5/文字/{}.png'

jpg_name = '../img/{:02}.jpg'
png_name = '../img/{:02}.png'

width = 640
height = 1240
size = (width, height)

space = 50

result = [[[Symbol('Story.jmp'), 0]]]
CLBG = Symbol('Story.clbg')
BG = Symbol('Story.bg')
CHOICE = Symbol('Story.choice')
IMG = Symbol('Story.img')
PAUSE = Symbol('Story.pause')
ED = Symbol('Story.ed')

import math
phi = (3-math.sqrt(5))/2

def openAndResize(name, width=None, height=None):
	im = Image.open(name)
	if height is not None:
		return im.resize((width, height))
	elif width is not None:
		sz = im.size
		ratio = width / sz[0]
		return im.resize((width, int(sz[1] * ratio)))
	else:
		return im

jpg_map = {}
def jpg(name, width=None, height=None):
	if name not in jpg_map:
		idx = len(jpg_map)
		new_name = jpg_name.format(idx)
		im = openAndResize(name, width, height)
		if 'end' in name:
			qr_size = qr.size
			im_size = im.size
			im.paste(qr, (im_size[0] - qr_size[0], im_size[1] - qr_size[1]))
		im.save(new_name)
		res_name = 'j%02d' % idx
		jpg_map[name] = (res_name,) + im.size
	return jpg_map[name]

png_map = {}
def png(name, width=None, height=None):
	if name not in png_map:
		idx = len(png_map)
		new_name = png_name.format(idx)
		im = openAndResize(name, width, height)
		im.save(new_name)
		res_name = 'p%02d' % idx
		png_map[name] = (res_name,) + im.size
	return png_map[name]
	

def process(li, name):
	chapter = []
	if isinstance(li, list):
		bg, w, h = jpg(bg_name.format(name), width, height)
		txt, w, h = png(txt_name.format(name), width)
		chapter = [
			[CLBG],
			[BG, bg],
		]
		choices = []
		btns = []
		btn_max_height = 0
		for i in range(0, len(li), 2):
			choices.append(process(li[i + 1], li[i]))
			btn_name, btn_w, btn_h = png(button_name.format(li[i]))
			btn_max_height = max(btn_max_height, btn_h)
			btns.append(btn_name)
		# place the elements at approximate position
		total_height = h + space + btn_max_height
		top = int(phi * (height - total_height))
		chapter.append([
			IMG, txt, 0, top
		])
		# construct choice
		choice_element = [CHOICE]
		num_choices = len(choices)
		hspace = width / num_choices
		per_hspace = (hspace - btn_w) / 2
		for i in range(num_choices):
			choice_element.append([btns[i], int(hspace * i + per_hspace), top + h + space, choices[i]])
		chapter.append(choice_element)
	else: #ending
		bg, w, h = jpg(bg_name.format('end%d' % li), width, height)
		chapter = [
			[CLBG],
			[ED, bg]
		]
	result.append(chapter)
	return len(result) - 1

# ins = [Image.open(txt_name.format('intro1')), Image.open(txt_name.format('intro2')), Image.open(txt_name.format('intro3'))]
# mw = max(map(lambda x: x.size[0], ins))
# th = sum(map(lambda x: x.size[1], ins)) + (len(ins) - 1) * space
# inim = Image.new('RGBA', (mw, th), (0,0,0,0))
# top = 0
# for im in ins:
# 	inim.paste(im, ((mw - im.size[0]) // 2, top))
# 	top += im.size[1] + space
# inim.save(txt_name.format('intro'))

with Image.open('qr.png') as qr:
	result[0][0][1] = process(logic, 'intro')

with open('result.js', 'w') as f:
	f.write(repr(result))
pprint(result, indent=2)
