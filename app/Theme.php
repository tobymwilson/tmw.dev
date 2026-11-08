<?php

namespace App;

use MM\Meros\App\BaseTheme;

use MM\Meros\Contracts\Features\Components\DynamicBlock;

class Theme extends BaseTheme {
    public function configure(): void {
        $this->assets()->make(function ($asset) {
            $asset->path('site/index.js', true)->enqueue();
        });

        // $this->dynamicBlocks()->make(function (DynamicBlock $block) {
        //     $block->name('example-block');
        //     $block->title('Example Block');
        //     $block->isSwitchable();
        //     $block->renderCallback(function () {
        //         return '<div style="border: 1px solid #000; padding: 10px;">Example Block</div>';
        //     });
        // });
    }
}
