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
        Schema::create('pedido', function (Blueprint $table) {
            $table->id();
            $table->char('quantidade_pedido', 4);
            $table->enum('status_pedido', ['pendente', 'em andamento', 'concluido', 'incompleto']);
            $table->dateTime('data_hora_pedido');
            $table->string('descricao_pedido', 1000);
            $table->string('url_requisicao_transfusao', 255)->unique();

            $table->char('cnpj_hospital', 14);
            $table->char('cnes_hemocentro', 7);
            $table->char('login_funcionario', 16);

            $table->foreign('cnpj_hospital')
                ->references('cnpj_hospital')->on('hospital')
                ->onDelete('cascade')
                ->onUpdate('cascade');


            $table->foreign('cnes_hemocentro')
                ->references('cnes_hemocentro')->on('hemocentro')
                ->onDelete('cascade')
                ->onUpdate('cascade');
            
            $table->foreign('login_funcionario')
                ->references('login_funcionario')->on('funcionario')
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
        Schema::dropIfExists('pedido');
    }
};
