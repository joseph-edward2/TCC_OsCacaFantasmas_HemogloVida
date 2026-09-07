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
        Schema::create('caderneta', function (Blueprint $table) {
            $table->string('numero_caderneta', 50)->primary();
            $table->string('cpf_doador', 11)->unique(); // 1 doador só pode ter 1 caderneta
            $table->date('data_validade_caderneta')->nullable();
            $table->date('data_emissao_caderneta')->nullable();

            $table->foreign('cpf_doador')
                ->references('cpf_doador')->on('doador')
                ->onDelete('cascade')
                ->onUpdate('cascade');
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('caderneta');
    }
};
