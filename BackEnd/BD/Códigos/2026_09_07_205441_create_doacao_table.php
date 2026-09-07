<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('doacao', function (Blueprint $table) {
            $table->id();
            $table->enum('status_bolsa_doacao', ['disponivel', 'enviado', 'em utilização']);
            $table->datetime('data_hora_doacao');
            $table->string('volume_ml_doacao', 3);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('doacao');
    }
};
