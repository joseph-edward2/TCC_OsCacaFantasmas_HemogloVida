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
        Schema::create('funcionario', function (Blueprint $table) {
            $table->string('nome_funcionario', 100);
            $table->string('login_funcionario', 16)->primary();
            $table->string('senha_funcionario', 100);
            $table->string('codigo_registro_funcionario',16)->unique();
            $table->enum('tipo_funcionario', ['responsavel_hemocentro', 'administrativo_hemocentro', 'responsavel_hospital', 'administrativo_hospital']);
            $table->char('cnes_hemocentro', 7)->nullable();
            $table->char('cnpj_hospital', 14)->nullable();
            $table->timestamps();

            $table->foreign('cnes_hemocentro')
                ->references('cnes_hemocentro')->on('hemocentro')
                ->onDelete('cascade')
                ->onUpdate('cascade');

            $table->foreign('cnpj_hospital')
                ->references('cnpj_hospital')->on('hospital')
                ->onDelete('cascade')
                ->onUpdate('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('funcionario');
    }
};
