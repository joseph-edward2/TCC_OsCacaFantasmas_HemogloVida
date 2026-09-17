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
        Schema::create('doador', function (Blueprint $table) {
            $table->char('cpf_doador', 11)->primary();
            $table->char('sus_doador', 15)->unique();
            $table->string('nome_doador', 100);
            $table->string('email_doador', 100);
            $table->string('senha_doador',100);
            $table->string('telefone_doador', 20);
            $table->string('tipo_sanguineo_doador', 3);
            $table->enum('sexo_doador', ['M', 'F']);
            $table->string('endereco_doador', 200);
            $table->date('data_nasc_doador');
            $table->string('peso_doador', 3);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('doador');
    }
};
