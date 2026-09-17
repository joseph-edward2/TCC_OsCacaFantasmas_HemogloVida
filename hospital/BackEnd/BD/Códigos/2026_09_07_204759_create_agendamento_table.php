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
        Schema::create('agendamento', function (Blueprint $table) {
            $table->char('protocolo_agendamento', 36)->primary();
            $table->dateTime('data_hora_agendamento');
            $table->enum('status_agendamento', ['pendente', 'confirmado', 'cancelado', 'faltou']);
            $table->enum('status_triagem_agendamento', ['aprovado', 'reprovado', 'pendente']);

            $table->char('cnes_hemocentro', 7);
            $table->char('cpf_doador', 11);

            $table->foreign('cnes_hemocentro')
                ->references('cnes_hemocentro')->on('hemocentro')
                ->onDelete('cascade')
                ->onUpdate('cascade');

            $table->foreign('cpf_doador')
                ->references('cpf_doador')->on('doador')
                ->onDelete('cascade')
                ->onUpdate('cascade');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('agendamento');
    }
};
