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
        Schema::create('hemocentro', function (Blueprint $table) {
            $table->char('cnes_hemocentro', 7)->primary();
            $table->char('cnpj_hemocentro', 14)->unique();
            $table->string('nome_hemocentro', 100);
            $table->string('endereco_hemocentro', 200);
            $table->string('contato_hemocentro', 255);
            $table->string('senha_hemocentro', 100);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('hemocentro');
    }
};
