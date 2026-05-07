<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cities', function (Blueprint $table) {
            $table->id();
            $table->string('city_name', 100);
            $table->string('note', 255)->nullable();
            $table->string('user_session', 255);
            $table->timestamps();

            $table->index('user_session', 'idx_user_session');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cities');
    }
};