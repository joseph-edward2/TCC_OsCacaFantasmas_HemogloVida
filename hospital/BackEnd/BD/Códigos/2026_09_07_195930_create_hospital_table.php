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
        Schema::create('hospital', function (Blueprint $table) {
            $table->char('cnpj_hospital', 14)->primary();
            $table->char('cnes_hospital', 7)->unique();
            $table->string('nome_hospital', 100);
            $table->string('endereco_hospital', 200);
            $table->string('contato_hospital', 255);
            $table->string('senha_hospital', 100);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('hospital');
    }
};
